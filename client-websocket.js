
const WebSocket = require("ws");
const CodecManager = require("./core/CodecManager");

class SDPClient {
    constructor() {
        this.transport = null;
        this.port = 8080; // ✅ Ensure this matches WebSocketTransport

        console.log(`🚀 Connecting to WebSocket on ws://localhost:${this.port}...`);
        this.connectWebSocket();
    }

    connectWebSocket() {
        this.transport = new WebSocket(`ws://localhost:${this.port}`);

        this.transport.on("open", () => {
            console.log("✅ WebSocket connected!");
        });

        this.transport.on("message", (data) => {
            console.log("📥 Response from server:", CodecManager.decode(data, "MsgPackTransport"));
        });

        this.transport.on("close", () => {
            console.log("🔌 WebSocket closed.");
        });

        this.transport.on("error", (error) => {
            console.error("🚨 WebSocket Error:", error.message);
        });
    }

    async sendRequest(serviceName, dataObject) {
        if (!this.transport || this.transport.readyState !== WebSocket.OPEN) {
            throw new Error("🚨 Transport is not connected yet.");
        }

        const encodedRequest = CodecManager.encode({ [serviceName]: dataObject }, "MsgPackTransport");
        console.log(`📤 Sending request: ${encodedRequest}`);
        this.transport.send(encodedRequest);
    }
}

// 🔥 Wait before running client
setTimeout(async () => {
    const client = new SDPClient();

    setTimeout(async () => {
        await client.sendRequest("User", { userId: 123 });
        await client.sendRequest("Device", { deviceId: "XYZ123" });
        await client.sendRequest("Feedback", { message: "Great service!", rating: 5 });
        await client.sendRequest("Order", { orderId: 9999, amount: 49.99 });
    }, 2000);
}, 2000);
