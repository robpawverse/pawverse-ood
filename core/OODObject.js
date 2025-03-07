const OODOutputManager = require("./OODOutputManager");

class OODObject {
    constructor(type, id, meta = {}, actions = {}, data = {}, relationships = {}) {
        this["@type"] = type;
        this["@id"] = id;
        this["@meta"] = { created_at: new Date().toISOString(), ...meta };
        this["@actions"] = { ...actions };
        this["@data"] = data;
        this["@relationships"] = relationships;
    }

    /**
     * 🔹 Ensure inheritance from another OODObject
     */
    inheritFrom(parentObject) {
        if (!(parentObject instanceof OODObject)) {
            throw new Error(`❌ Cannot inherit from a non-OODObject: ${parentObject["@id"]}`);
        }

        console.log(`🟢 ${this["@id"]} is inheriting from ${parentObject["@id"]}`);
        this["@meta"] = { ...parentObject["@meta"], ...this["@meta"] };
        this["@actions"] = { ...parentObject["@actions"], ...this["@actions"] };
        this["@data"] = { ...parentObject["@data"], ...this["@data"] };
        this["@relationships"] = { ...parentObject["@relationships"], ...this["@relationships"] };

        // 🔥 Ensure that convertFormat() is inherited properly
        this.convertFormat = parentObject.convertFormat;
    }

    /**
     * 🔹 Advertise Object Actions to SDP (✅ KEPT INTACT)
     */
    advertiseActions() {
        return {
            "@type": this["@type"],
            "@id": this["@id"],
            "available_actions": Object.keys(this["@actions"])
        };
    }

    /**
     * 🔹 Convert Object to Selected Format (✅ FIXED FORMATTING)
     */
    convertFormat(format) {
        try {
            const outputManager = new OODOutputManager(format);
            return outputManager.format(this);
        } catch (err) {
            return { error: `Format '${format}' not supported or failed to load` };
        }
    }
}

module.exports = OODObject;
