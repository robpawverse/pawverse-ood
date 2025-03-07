const CodecManager = require("./CodecManager");

class DataObject {
    constructor({ resourceType, data, relationships = {}, meta = {}, transportType = "MsgPackTransport" }) {
        this._meta = {
            resourceType,
            createdAt: new Date().toISOString(),
            ...meta,
        };
        this.data = data;
        this.relationships = relationships;

        // ✅ Set MsgPack as default transport
        this.transportType = transportType;
        this.transport = CodecManager.getTransport(this.transportType);
    }

    toTransport() {
        return this.transport.encode({
            _meta: this._meta,
            data: this.data,
            relationships: this.relationships,
            transportType: this.transportType
        }); // ✅ REMOVE transport field
    }

    static fromTransport(serializedData, transportType = "MsgPackTransport") {
        const transport = CodecManager.getTransport(transportType);
        const parsed = transport.decode(serializedData);

        return new DataObject(parsed);
    }
}

module.exports = DataObject;
