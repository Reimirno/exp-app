import os from "os";

export const getLocalIp = (): string | undefined => {
  var ifaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
  for (let dev in ifaces) {
    const iface = ifaces[dev]!.filter((details: any) => {
      return (
        details.family === "IPv4" &&
        details.internal === false &&
        !details.mac.startsWith("00:50:56") //filter out VMware NICs
      );
    });

    if (iface.length > 0) {
      const address = iface[0].address;
      return address;
    }
  }
};
