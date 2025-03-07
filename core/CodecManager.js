const OODObject = require("../core/OODObject");  // ✅ Import OODObject

class CodecManager {
    constructor() {
        this.transports = {
            "OODTransport": {
                encode: (data) => {
                    if (!(data instanceof OODObject)) {
                        console.warn("⚠️ Warning: Encoding non-OOD data, auto-wrapping...");
                        data = new OODObject("Generic", "auto-id", {}, {}, data, {});
                    }
                    return Buffer.from(JSON.stringify(data));  // ✅ Always return a Buffer
                },
                decode(data, format = this.defaultTransport) {
                    if (!data) throw new Error("❌ Cannot decode empty data");

                    try {
                        const jsonData = JSON.parse(data.toString("utf-8"));

                        // ✅ Ensure it always returns a real `OODObject`
                        return new OODObject(
                            jsonData["@type"] || "Unknown",
                            jsonData["@id"] || "auto-id",
                            jsonData["@meta"] || {},
                            jsonData["@actions"] || {},
                            jsonData["@data"] || {},
                            jsonData["@relationships"] || {}
                        );
                    } catch (error) {
                        throw new Error(`❌ Error decoding OOD data: ${error.message}`);
                    }
                }


            }
        };

        // ✅ OOD is the **ONLY** format now!
        this.defaultTransport = "OODTransport";
    }

    detectTransportType(msg) {
        return "OODTransport";  // ✅ No other format detection—EVERYTHING is OOD!
    }

    encode(data, format = this.defaultTransport) {
        return this.transports[format].encode(data);
    }

    decode(data, format = this.defaultTransport) {
        return this.transports[format].decode(data);
    }
}

module.exports = new CodecManager();
