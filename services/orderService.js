const Service = require("./Service");

class OrderService extends Service {
    constructor() {
        super("Order");
        console.log("✅ OrderService Initialized");
    }


}

module.exports = OrderService;
