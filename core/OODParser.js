const OODObject = require("./OODObject");
const OOD_MATRIX = require("../config/OODMatrix"); // ✅ Import OOD_MATRIX

class OODParser {
    constructor() {
        this.objects = {};

        // ✅ Ensure all objects in OOD_MATRIX exist before parsing
        Object.keys(OOD_MATRIX).forEach((objType) => {
            const defaultId = `${objType.toLowerCase()}-default`;
            if (!this.objects[defaultId]) {
                this.objects[defaultId] = new OODObject(objType, defaultId);
            }
        });
    }

    parse(oodText) {
        const regex = /(\w+)\s*\(\s*id="(.*?)"\s*\)(.*?)\n---/gs;
        let match;

        while ((match = regex.exec(oodText)) !== null) {
            const [_, objType, objId, content] = match;

            // ✅ Ensure object is always stored in `this.objects`
            if (!this.objects[objId]) {
                this.objects[objId] = new OODObject(objType, objId);
            }

            this.fillObjectData(this.objects[objId], content);
        }

        // ✅ Debugging: Ensure PawPoints exists
        if (!this.objects["user-123-credits"]) {
            console.error("❌ ERROR: PawPoints object is missing! 🔄 Auto-creating it...");
            this.objects["user-123-credits"] = new OODObject("PawPoints", "user-123-credits");
        } else {
            console.log("✅ PawPoints object successfully parsed!");
        }

        // ✅ Apply inheritance AFTER all objects exist
        this.applyInheritance();

        return this.objects;
    }

    fillObjectData(obj, content) {
        ["meta", "data", "relationships", "actions"].forEach(field => {
            const pattern = new RegExp(`:${field}\\((.*?)\\)`, "s");
            const match = pattern.exec(content);
            if (match) {
                obj[`@${field}`] = this.parseKeyValuePairs(match[1]);
            }
        });
    }

    /**
     * 🔹 Apply OOD Inheritance Rules
     */
    applyInheritance() {
        for (const objId in this.objects) {
            let obj = this.objects[objId];

            if (!(obj instanceof OODObject)) {
                console.error(`❌ ERROR: ${objId} is NOT an instance of OODObject!`);
                this.objects[objId] = new OODObject(
                    obj["@type"],
                    obj["@id"],
                    obj["@meta"],
                    obj["@actions"],
                    obj["@data"],
                    obj["@relationships"]
                );
                obj = this.objects[objId]; // ✅ Fix reference
            }

            const parentType = OOD_MATRIX[obj["@type"]]?.inherits[0];

            if (parentType) {
                for (const parentId in this.objects) {
                    if (this.objects[parentId]["@type"] === parentType) {
                        console.log(`🔄 Applying inheritance: ${objId} inherits from ${parentId}`);
                        obj.inheritFrom(this.objects[parentId]);
                        break;
                    }
                }
            }
        }
    }

    parseKeyValuePairs(kvString) {
        return kvString.split(", ")
            .map(pair => pair.split("="))
            .reduce((acc, [key, value]) => {
                acc[key.trim()] = value ? value.trim().replace(/"/g, '') : null;
                return acc;
            }, {});
    }
}

module.exports = OODParser;
