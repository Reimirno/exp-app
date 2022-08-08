import os from "os";
export const getLocalIp = () => {
    var ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
        const iface = ifaces[dev].filter((details) => {
            return (details.family === "IPv4" &&
                details.internal === false &&
                !details.mac.startsWith("00:50:56"));
        });
        if (iface.length > 0) {
            const address = iface[0].address;
            return address;
        }
    }
};
//# sourceMappingURL=utils.js.map