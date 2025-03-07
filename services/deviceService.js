const Service = require("./Service");

class DeviceService extends Service {
    constructor() {
        super("Device");
        console.log("✅ DeviceService Initialized");
    }

}

module.exports = DeviceService;
