const OODObject = require("../core/OODObject");
const OOD_MATRIX = require("../config/OODMatrix");

class Service {
    constructor(serviceName) {
        this.serviceName = serviceName;

        // ✅ Get parent type (if exists)
        this.parentType = OOD_MATRIX[serviceName]?.inherits[0] || null;
    }

    /**
     * ✅ Register service dynamically in the processor
     */
    register(processor, handler) {
        if (!processor || typeof processor.register !== "function") {
            console.error(`🚨 Processor not initialized for ${this.serviceName}`);
            return;
        }
        console.log(`🔹 Registering service: ${this.serviceName}`);
        processor.register(this.serviceName, handler);
    }

    /**
     * ✅ Process request & enforce OOD principles
     */
    async process(data) {
        console.log(`🔹 [${this.serviceName}] Processing Data:`, data);

        // ✅ Inherit metadata & actions from parent type (if exists)
        let parentMeta = {};
        let parentActions = {};
        if (this.parentType) {
            console.log(`🔄 Inheriting from parent: ${this.parentType}`);
            const parent = new OODObject(this.parentType, "inherited-id", {}, {}, {}, {});
            parentMeta = parent["@meta"];
            parentActions = parent["@actions"];
        }

        // ✅ Construct Full OOD Response
        return new OODObject(
            this.serviceName,
            "response-id",
            { ...parentMeta }, // ✅ Inherit metadata
            { ...parentActions }, // ✅ Inherit actions
            data,
            {} // ✅ Relationships can be added dynamically later
        );
    }
}

module.exports = Service;

