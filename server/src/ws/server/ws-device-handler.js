/*
  Author: André Kreienbring
  Handles websocket messages related with devices.
*/
const shellyDevices = require("@devices/shellyDevices.js");
const shellyConnector = require("@devices/shellyConnector.js");

const db = require("@db/db.js");

function handle(msg, ws) {
  if (msg.event === "devices get all") {
    /*
      A dashboard client needs the list of devices.
    */
    shellyDevices.getDevices().then((devices) => {
      const answer = {
        event: "devices get all",
        data: {
          requestID: msg.data.requestID,
        },
      };
      const userid = msg.data.userid;

      if (userid != null) {
        console.log(`Sending only the devices of user ${userid}`);
        const sql = `SELECT device_id FROM user_devices WHERE user_id = ?`;
        let userdevices = db.get(sql, [userid]);
        userdevices = userdevices.map((object) => {
          return object.device_id;
        });
        answer.data.message = `OK! Here are all the devices of user ${userid}`;
        devices = devices.filter((device) => userdevices.includes(device.id));
      } else {
        console.log(`Sending all the devices for an admin`);
        answer.data.message = `OK! Here are all the devices`;
      }
      answer.data.devices = devices;
      ws.send(JSON.stringify(answer));
    });
  } else if (msg.event === "devices timeline get") {
    /*
      A dashboard client needs the list of devices.
      And the initial timeline by minutes
    */
    shellyDevices.getDevices().then((devices) => {
      const answer = {
        event: "devices timeline get",
        data: {
          message: "OK! Here are all the devices and the timeline!",
          devices: devices,
          requestID: msg.data.requestID,
        },
      };
      answer.data.rows = db.select("cByMinute", [], [], [], null, "ts");
      ws.send(JSON.stringify(answer));
    });
  } else if (msg.event === "devices stable update") {
    /*
      A dashboard client wants to update a device to a stable version.
      Every Device will be updated and a marker is set in the device object.
      A ShellyUpdate event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.updateStablePending = true;
        delete device.wsmessages.NotifyFullStatus;
        const updateMessage = {
          event: "ShellyUpdate",
          type: "device",
          data: {
            source: "WSDeviceHandler",
            message: "Stable update triggered",
            device,
            subscriptionID: device.id,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.updateToStable(device);
      }
    }
  } else if (msg.event === "devices beta update") {
    /*
      A dashboard client wants to update a device to a beta version.
      Every Device will be updated and a marker is set in the device object.
      A ShellyUpdate event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.updateBetaPending = true;
        delete device.wsmessages.NotifyFullStatus;
        const updateMessage = {
          event: "ShellyUpdate",
          type: "device",
          data: {
            source: "WSDeviceHandler",
            message: "Beta update triggered",
            device,
            subscriptionID: device.id,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.updateToBeta(device);
      }
    }
  } else if (msg.event === "devices reboot") {
    /*
      A dashboard client wants to reboot devices.
      Every Device will be rebooteda and a marker is set in the device object.
      A ShellyUpdate event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.rebootPending = true;
        delete device.wsmessages.NotifyFullStatus;
        const updateMessage = {
          event: "ShellyUpdate",
          type: "device",
          data: {
            source: "WSDeviceHandler",
            message: "Reboot triggered",
            device,
            subscriptionID: device.id,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.rebootDevice(device);
      }
    }
  } else if (msg.event === "device get wifi settings") {
    /*
      A dashboard client wants to get the wifi settings of a device.
      The device is identified by its ID.
    */
    const deviceId = msg.data.deviceId;
    const device = shellyDevices.findDeviceById(deviceId);
    if (typeof device !== "undefined") {
      const answer = {
        event: "device get wifi settings",
        data: {
          requestID: msg.data.requestID,
          message: `OK! Here are the wifi settings of device ${device.cname}`,
        },
      };

      shellyConnector.getWifiSettings(device).then((wifisettings) => {
        answer.data.wifisettings = wifisettings;
        ws.send(JSON.stringify(answer));
      });
    } else {
      console.error(`Device with ID ${deviceId} not found`);
    }
  } else if (msg.event === "device wifi update") {
    const updateAnswer = {
      event: "device wifi update",
      data: {
        message: "_wifiupdated_",
        success: true,
        requestID: msg.data.requestID,
      },
    };

    const promises = [];
    const devices = [];

    // create an array of promises
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        promises.push(shellyConnector.setWifiSettings);
        devices.push(device);
      } else {
        console.error(`Device with ID ${device.ip} not found`);
      }
    }

    // run every promise in sequence (promise chain)
    let promise = promises[0](devices[0], msg.data.wifiSettings, 0);
    for (let i = 1; i < promises.length; i++) {
      promise = promise.then((result) =>
        promises[i](devices[i], msg.data.wifiSettings, result)
      );
    }

    // if the last promise is resolved, send the result to the client
    promise.then((result) => {
      if (result === msg.data.ids.length) {
        updateAnswer.data.message = "_wifiupdated_";
        updateAnswer.data.success = true;
        updateAnswer.data.total = msg.data.ids.length;
        updateAnswer.data.successful = result;
      } else {
        updateAnswer.data.message = "_wifinotupdated_";
        updateAnswer.data.success = false;
        updateAnswer.data.total = msg.data.ids.length;
        updateAnswer.data.successful = result;
      }
      ws.send(JSON.stringify(updateAnswer));
    });
  } else {
    console.error(`Unknown websocket event '${msg.event}'`);
  }
}

module.exports = {
  handle,
};
