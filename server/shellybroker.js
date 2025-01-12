/*
  see also: 
  https://github.com/ALLTERCO/fleet-management
  https://github.com/ALLTERCO/shelly-outbound-websockets
  https://github.com/Luligu/matterbridge

  https://github.com/alexryd/node-shellies-ng
  https://github.com/alexnederlof/shelly-admin

  Author: André Kreienbring
  ShellyBroker is a http and websocket server that serves as middle layer 
  between Shelly devices and other applications, like a Shelly Dashboard
  The http server is used to create webservice endpoints that clients connect to 
  to receive or transmit data from the Shelly devices or to the websocket server.

  To use ShellyBroker a list of IP adresses must be configured (devices.json).
  This list is used to retrieve data from every configured device. 
  Such as system information, scripts and KVS.
*/
require("module-alias/register");

const config = require("config");
const WebSocket = require("faye-websocket");
const dgram = require("dgram");
const expressServer = require("@http/server");
const requestIp = require("request-ip");

const wsHandler = require("@ws/server/wshandler.js");
const wsMessageValidator = require("@ws/server/ws-message-validator.js");

const shellyGen2Conn = require("@http/shellyGen2Conn.js");

const port = config.get("http-server.port");
const udpAdress = config.get("udp-server.host");
const udpServer = dgram.createSocket("udp4");

// express is used to handle the http endpoints and serves the static public folder
const httpserver = expressServer.listen(port);

/* 
  when a websocket clients connects he sends an 'upgrade' request.
  Further messages and events are handled by 'wsHandler'
*/
httpserver.on("upgrade", function (request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    const clientIP = requestIp.getClientIp(request);
    console.log(`${clientIP} just requested a ws upgrade`);
    if (typeof clientIP === "undefined" || clientIP === null) return;

    if (wsMessageValidator.blockedIPs.includes(clientIP)) {
      console.error(`${clientIP} is currently blocked. Upgrade is denied`);
      return;
    }

    const ws = new WebSocket(request, socket, body);
    // add the IP to the websocket to identify it in events
    ws.clientIP = clientIP;

    ws.on("message", function (event) {
      const msg = wsMessageValidator.validateMessage(event.data, ws);
      if (msg !== null) wsHandler.handleMessage(msg, ws);
    });

    ws.on("open", function () {
      wsHandler.handleOpen(ws);
    });

    ws.on("close", function (event) {
      delete wsMessageValidator.clientLimits[ws.clientIP];
      wsHandler.handleClose(event, ws);
    });
  }
});

/*
  The UDP Server is used to receive log messages from Shelly devices
*/

// Event when receiving an UDP message
udpServer.on("message", (msg, rinfo) => {
  //console.log(`UDP Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  shellyGen2Conn.handleLogMessage(msg, rinfo);

  /* Respond to the client
  udpServer.send('Message received by the server', rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error('Error sending message:', err);
    } else {
      console.log('Response sent to the client');
    }
  });
  */
});

// Event when the server is ready and listening
udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(
    `ShellyBroker UDP server started at ${address.address}:${address.port}`
  );
});

// Handle errors
udpServer.on("error", (err) => {
  console.error("Error in UDP server:", err);
  udpServer.close();
});

udpServer.bind({
  address: udpAdress,
  port: port,
  exclusive: true,
});
