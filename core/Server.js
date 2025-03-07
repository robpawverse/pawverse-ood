const OODObject = require("../core/OODObject");  // ✅ Import OODObject
const CodecManager = require("./CodecManager");
const zmq = require("zeromq");

class Server {
    constructor(processor) {
        this.processor = processor;
        this.port = "tcp://*:5555";
        this.responseSocket = new zmq.Reply();
    }

    async start() {
        await this.responseSocket.bind(this.port);
        console.log(`✅ SDP Server is running on ${this.port} using OOD`);

        for await (const [msg] of this.responseSocket) {
            await this.handleMessage(msg);
        }
    }
    async handleMessage(msg) {
        try {
            console.log("📥 Raw Request Received (Hex):", msg.toString("hex"));
            console.log("📥 Raw Request Received (UTF-8):", msg.toString("utf-8"));

            let decodedRequest;
            try {
                decodedRequest = CodecManager.decode(msg, "OODTransport");
                console.log("✅ Decoded OOD Request:", decodedRequest);
            } catch (error) {
                console.error("🚨 Failed to decode request:", error);
                await this.responseSocket.send(CodecManager.encode({ error: "Invalid OOD request" }, "OODTransport"));
                return;
            }

            // ✅ Ensure request is a valid OODObject
            if (!(decodedRequest instanceof OODObject)) {
                console.error("❌ Received invalid OODObject:", decodedRequest);
                await this.responseSocket.send(CodecManager.encode({ error: "Malformed OODObject" }, "OODTransport"));
                return;
            }

            console.log("📡 Processing OOD Request for:", decodedRequest["@type"]);

            const responseData = await this.processor.handleRequest(decodedRequest["@type"], decodedRequest["@data"]);

            // ✅ Wrap response as an OODObject before sending
            const oodResponse = new OODObject(
                decodedRequest["@type"],
                "response-id",
                {},
                {},
                responseData.data, // ✅ Ensure only raw data is sent
                {}
            );

            console.log("📤 Sending Response as OODObject:", oodResponse);
            await this.responseSocket.send(CodecManager.encode(oodResponse, "OODTransport"));

        } catch (error) {
            console.error("🚨 Error processing request:", error);
            await this.responseSocket.send(CodecManager.encode({ error: "Server error" }, "OODTransport"));
        }
    }



}

module.exports = Server;
