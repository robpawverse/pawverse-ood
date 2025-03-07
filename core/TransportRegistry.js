class TransportRegistry {
    constructor() {
        this.transports = {};  // ✅ Store registered transport classes
    }

    /**
     * ✅ Registers a transport dynamically (called from transport classes)
     */
    registerTransport(name, transportClass) {
        if (!this.transports[name]) {
            this.transports[name] = transportClass;
            console.log(`✅ Registered Transport: ${name}`);
        }
    }

    /**
     * ✅ Retrieves a transport instance dynamically
     */
    getTransport(name, network = "WAN") {
        if (!this.transports[name]) {
            console.warn(`⚠️ Transport ${name} not found. Defaulting to ZeroMQ.`);
            return this.transports["ZeroMQ"]; // ✅ Default transport
        }
        return new this.transports[name](network);
    }

    /**
     * ✅ Lists available transports
     */
    listTransports() {
        return Object.keys(this.transports);
    }
}

module.exports = new TransportRegistry();
