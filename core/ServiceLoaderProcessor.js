const fs = require("fs");
const path = require("path");
const Processor = require("./Processor"); // ✅ Corrected import path

class ServiceLoaderProcessor extends Processor {
    constructor() {
        super();
        this.loadHandlers(); // ✅ Auto-load services on initialization
    }

    /**
     * ✅ Dynamic service loading without modifying base `Processor`
     */
    loadHandlers() {
        const servicesDir = path.join(__dirname, "../services");

        if (!fs.existsSync(servicesDir)) {
            console.error("🚨 Services directory missing. Cannot start.");
            process.exit(1);
        }

        fs.readdirSync(servicesDir).forEach((file) => {
            if (file.endsWith(".js") && file !== "Service.js") { // ✅ Exclude Service.js
                try {
                    console.log(`🔍 Loading service file: ${file}`);
                    const ServiceClass = require(path.join(servicesDir, file));

                    if (typeof ServiceClass === "function") {
                        const serviceInstance = new ServiceClass(); // ✅ Auto-instantiate
                        if (serviceInstance.register) {
                            serviceInstance.register(this, serviceInstance.process.bind(serviceInstance)); // ✅ Auto-register
                            console.log(`✅ Service registered: ${file}`);
                        }
                    } else {
                        console.warn(`⚠️ Service ${file} did not register correctly`);
                    }
                } catch (error) {
                    console.error(`🚨 Failed to load service ${file}:`, error);
                    process.exit(1);
                }
            }
        });

        console.log("📦 Registered Services:", Object.keys(this.handlers));
    }
}

// ✅ Auto-initializes dynamically, ensuring full SDP compliance.
module.exports = new ServiceLoaderProcessor();
