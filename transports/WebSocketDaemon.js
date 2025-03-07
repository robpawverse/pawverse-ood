const WebSocket = require("ws");
const OODObject = require("../core/OODObject"); // ✅ Import OODObject
const processor = require("../core/ServiceLoaderProcessor");
const PortRouter = require("../core/PortRouter"); // ✅ Dynamic port assignment

class WebSocketTransport {
    constructor() {
        this.port = null;
        this.server = null;
    }

    async start() {
        this.port = await PortRouter.assignPort("WebSocket");

        try {
            this.server = new WebSocket.Server({ port: this.port });
            console.log(`✅ WebSocket running on ws://localhost:${this.port} using OOD`);
        } catch (error) {
            console.error(`🚨 Failed to start WebSocket on port ${this.port}:`, error.message);
            process.exit(1);
        }

        this.server.on("connection", (socket) => {
            console.log("🔗 New WebSocket client connected");

            socket.on("message", async (message) => {
                try {
                    console.log("📥 WebSocket Received (UTF-8):", message.toString("utf-8"));

                    // ✅ Decode directly into OODObject
                    const requestData = JSON.parse(message);

                    if (!requestData["@type"] || !requestData["@id"]) {
                        console.error("❌ Invalid OODObject structure:", requestData);
                        socket.send(JSON.stringify({ error: "Malformed OODObject" }));
                        return;
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
                    socket.send(JSON.stringify(oodResponse));

                } catch (error) {
                    console.error("🚨 Error processing WebSocket request:", error);
                    socket.send(JSON.stringify({ error: "Server error" }));
                }
            });

            socket.on("close", () => {
                console.log("🔌 WebSocket client disconnected");
            });
        });
    }
}

module.exports = WebSocketTransport;
