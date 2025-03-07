const Service = require("./Service");

class FeedbackService extends Service {
    constructor() {
        super("Feedback");
        console.log("✅ FeedbackService Initialized");
    }


}

module.exports = FeedbackService;
