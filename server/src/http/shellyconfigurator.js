/*
  Author: André Kreienbring
*/
const config = require("config");

/**
    After loading the devices, shellyGen2Conn triggers this function once
    to send WebSocket and UDP configuration to all devices.
    @param {array} devices The array with all devices
    @param {function} getRPCMethod The function that is used to send the POST requests to a device.
*/
function configureShellies(devices, getRPCMethod) {
  const setWS = config.get("shelly.set-ws");
  const setUDP = config.get("shelly.set-udp");

  if (setWS || setUDP) {
    const udpConfig = `${config.get("udp-server.host")}:${config.get(
      "udp-server.port"
    )}`;
    const wsConfig = `ws://${config.get("ws-server.host")}:${config.get(
      "ws-server.port"
    )}`;
    console.log("Updating WS and UDP Settings on all devices");
    for (const device of devices) {
      if (device.gen > 1 && setUDP) {
        getRPCMethod(device, "Sys.SetConfig", {
          config: { debug: { udp: { addr: udpConfig } } },
        })
          .then((res) => {
            if (res.status === 200) {
              console.log(
                `Successfully configured UDP debug on ${device.cname}`
              );
            } else {
              console.log(
                `Got status ${res.status}. Couldn't configure UDP debug on ${device.cname}`
              );
            }
          })
          .catch((err) => {
            console.error(err.message);
          });
      }
      if (device.gen > 1 && setWS) {
        getRPCMethod(device, "Ws.SetConfig", {
          config: {
            server: wsConfig,
            enabled: true,
          },
        })
          .then((res) => {
            if (res.status === 200 && typeof res.data.result !== "undefined") {
              console.log(
                `Successfully configured the outbound Websocket on ${device.cname}`
              );
              // This configuration requiers a restart of the device!
              // Could be done automatically!
            } else {
              console.error(
                `Couldn't configure the outbound Websocket on ${device.cname}`
              );
            }
          })
          .catch((err) => {
            console.error(err.message);
          });
      }
    }
  }
}

module.exports = { configureShellies };
