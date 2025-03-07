const net = require("net");

class PortRouter {
    constructor() {
        this.allocatedPorts = new Set();
        this.routingTable = {
            "ZeroMQ": 5555,   // Default ZeroMQ port
            "WebSocket": 8080 // Default WebSocket port
        };
        this.portMap = {}; // Stores assigned ports
    }

    /**
     * ✅ Checks if a port is available
     */
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.once("error", () => resolve(false));
            server.listen(port, () => {
                server.close(() => resolve(true));
            });
        });
    }

    /**
     * 🚀 Assigns an available port for a transport
     */
    async assignPort(transport) {
        let basePort = this.routingTable[transport] || 5000; // Default to 5000 if undefined

        if (await this.isPortAvailable(basePort)) {
            this.allocatedPorts.add(basePort);
            this.portMap[transport] = basePort;
            console.log(`✅ Assigned Port ${basePort} for ${transport}`);
            return basePort;
        }

        // 🚀 Find next available port if default is taken
        let newPort = basePort + 1;
        while (!(await this.isPortAvailable(newPort))) {
            newPort++;
        }

        this.allocatedPorts.add(newPort);
        this.portMap[transport] = newPort;
        console.log(`✅ Auto-Assigned Port ${newPort} for ${transport}`);
        return newPort;
    }

    /**
     * ✅ Releases a port when a transport stops
     */
    releasePort(port) {
        if (this.allocatedPorts.has(port)) {
            this.allocatedPorts.delete(port);
            console.log(`🔄 Released Port ${port}`);
        } else {
            console.warn(`⚠️ Attempted to release untracked port: ${port}`);
        }
    }

    /**
     * ✅ Gets the currently assigned port for a transport
     */
    getPort(transport) {
        return this.portMap[transport] || null;
    }
}

module.exports = new PortRouter();
