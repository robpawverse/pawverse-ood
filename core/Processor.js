class Processor {
    constructor() {
        this.handlers = {};
        console.log("✅ Processor Initialized");
    }

    register(resourceType, handlerFunction) {
        console.log(`🔹 Registering handler for: ${resourceType}`);
        this.handlers[resourceType] = handlerFunction;
    }
    async handleRequest(resourceType, data) {
        console.log(`📥 Handling Request: ${resourceType}`);  // ✅ NEW DEBUG LOG

        if (this.handlers[resourceType]) {
            console.log(`🔹 Using Registered Handler for: ${resourceType}`); // ✅ NEW DEBUG LOG
            return await this.handlers[resourceType](data);
        } else {
            console.warn(`⚠️ Unknown resource: ${resourceType}`);
            return { error: `Unknown resource: ${resourceType}` };
        }
    }


}

// ✅ No instance creation here (avoids circular dependencies)
module.exports = Processor;
