const TransportRouter = require("./core/TransportRouter");
const Server = require("./core/Server");
const processor = require("./core/ServiceLoaderProcessor");

(async () => {
    await TransportRouter.use("ZeroMQ");

    const sdpServer = new Server(processor);
    sdpServer.start();
})();
