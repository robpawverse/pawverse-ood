const OODObject = require("./core/OODObject");  // ✅ Import OODObject
const zmq = require("zeromq");
const CodecManager = require("./core/CodecManager");

class SDPClient {
    constructor() {
        this.port = 5555;
        this.socket = new zmq.Request();
        this.socket.connect(`tcp://localhost:${this.port}`);
    }

    async sendRequest(serviceName, dataObject) {
        const oodRequest = new OODObject(serviceName, "auto-id", {}, {}, dataObject, {});
        const encodedRequest = CodecManager.encode(oodRequest, "OODTransport");

        console.log("📤 Sending Native OOD request:", oodRequest);
        await this.socket.send(encodedRequest);

        const [response] = await this.socket.receive();
        const decodedResponse = CodecManager.decode(response, "OODTransport");

        console.log("📥 Response from server:", decodedResponse);
    }
}

// 🔥 Run ZeroMQ Client
(async () => {
    const client = new SDPClient();

    await client.sendRequest("User", { userId: 123 });
    await client.sendRequest("Device", { deviceId: "XYZ123" });
    await client.sendRequest("Feedback", { message: "Great service!", rating: 5 });
    await client.sendRequest("Order", { orderId: 9999, amount: 49.99 });
})();
