const { fork } = require("child_process");

// List of transport daemons
const transports = ["ZeroMQDaemon.js", "WebSocketDaemon.js"];

transports.forEach((daemon) => {
    const process = fork(`./transports/${daemon}`);
    console.log(`🚀 Started ${daemon} as a separate process (PID: ${process.pid})`);
});
