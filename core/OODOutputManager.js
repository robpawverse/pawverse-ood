const yaml = require("js-yaml");
const xml2js = require("xml2js");
const msgpack = require("msgpack5")();

/**
 * 🔹 Helper function to clean object keys for XML compatibility
 */
function cleanKeysForXML(obj) {
    if (typeof obj !== "object" || obj === null) return obj;

    if (Array.isArray(obj)) {
        return obj.map(cleanKeysForXML);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const newKey = key.replace(/^@/, "").replace(/\(/g, "").replace(/\)/g, ""); // ✅ Remove invalid characters
        acc[newKey] = cleanKeysForXML(obj[key]);
        return acc;
    }, {});
}

/**
 * 🔹 Hardcoded format handlers
 */
const FORMAT_HANDLERS = {
    json: {
        convert: (data) => JSON.stringify(data, null, 4),
    },
    yaml: {
        convert: (data) => yaml.dump(data),
    },
    xml: {
        convert: (data) => {
            const builder = new xml2js.Builder({
                renderOpts: { pretty: true },
                headless: true,
            });

            return builder.buildObject(cleanKeysForXML(data)); // ✅ Fix XML names
        },
    },
    msgpack: {
        convert: (data) => msgpack.encode(data),
    },
    protobuf: {
        convert: (data) => "🔹 Protobuf serialization is a placeholder – implement as needed.",
    },
};

class OODOutputManager {
    constructor(format) {
        this.formatHandlers = FORMAT_HANDLERS;
        this.selectedFormat = format.toLowerCase();

        console.log(`🔍 Available formats: ${Object.keys(this.formatHandlers).join(", ")}`);
    }

    /**
     * 🔹 Convert Object to Selected Format
     */
    format(oodObject) {
        const handler = this.formatHandlers[this.selectedFormat];

        if (!handler) {
            return { error: `Format '${this.selectedFormat}' not supported or failed to load` };
        }

        try {
            return handler.convert(oodObject);
        } catch (err) {
            return { error: `Error converting to ${this.selectedFormat}: ${err.message}` };
        }
    }
}

module.exports = OODOutputManager;
