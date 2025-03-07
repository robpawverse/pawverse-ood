const Service = require("./Service");

class UserService extends Service {
    constructor() {
        super("User"); // ✅ Base class automatically applies OOD principles
    }
}

module.exports = UserService;
