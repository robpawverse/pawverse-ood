const zmq = require("zeromq");
const OODObject = require("../core/OODObject"); // ✅ Import OODObject
const processor = require("../core/ServiceLoaderProcessor");
const PortRouter = require("../core/PortRouter"); // ✅ Dynamic port assignment

class ZeroMQTransport {
    constructor() {
        this.socket = new zmq.Reply();
        this.port = null;
    }

    async start() {
        this.port = await PortRouter.assignPort("ZeroMQ");

        try {
            await this.socket.bind(`tcp://*:${this.port}`);
            console.log(`✅ ZeroMQ running on tcp://*:${this.port} using OOD`);
        } catch (error) {
            console.error(`🚨 Failed to start ZeroMQ on port ${this.port}:`, error.message);
            process.exit(1);
        }

        for await (const [msg] of this.socket) {
            try {
                console.log("📥 ZeroMQ Received (Raw Buffer):", msg.toString("utf-8"));

                // ✅ Decode directly into OODObject
                const requestData = JSON.parse(msg.toString("utf-8"));

                if (!requestData["@type"] || !requestData["@id"]) {
                    console.error("❌ Invalid OODObject structure:", requestData);
                    await this.socket.send(JSON.stringify({ error: "Malformed OODObject" }));
                    continue;
                }

                console.log("📡 Processing OOD Request for:", requestData["@type"]);

                const responseData = await processor.handleRequest(requestData["@type"], requestData["@data"]);

                // ✅ Ensure response is an OODObject
                const oodResponse = new OODObject(
                    requestData["@type"],
                    "response-id",
                    {},
                    {},
                    responseData,
                    {}
                );

                console.log("📤 Sending Response as OODObject:", oodResponse);
                await this.socket.send(JSON.stringify(oodResponse));

            } catch (error) {
                console.error("🚨 Error processing ZeroMQ request:", error);
                await this.socket.send(JSON.stringify({ error: "Server error" }));
            }
        }
    }
}

module.exports = ZeroMQTransport;
