const WebSocketTransport = require("../transports/WebSocketDaemon");
const ZeroMQTransport = require("../transports/ZeroMQDaemon");

class TransportRouter {
    constructor() {
        this.activeTransport = null;
    }

    /**
     * ✅ Selects the transport and starts it
     */
    async use(transportName) {
        if (transportName === "WebSocket") {
            this.activeTransport = new WebSocketTransport();
        } else if (transportName === "ZeroMQ") {
            this.activeTransport = new ZeroMQTransport();
        } else {
            throw new Error(`🚨 Invalid transport: ${transportName}`);
        }

        console.log(`🚀 Using Transport: ${transportName}`);
        await this.activeTransport.start(); // ✅ Start transport
    }

    /**
     * ✅ Returns the active transport
     */
    getActiveTransport() {
        return this.activeTransport;
    }
}

module.exports = new TransportRouter();
