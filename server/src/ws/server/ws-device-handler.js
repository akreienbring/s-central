/*
  Author: André Kreienbring
  Handles websocket messages related with devices.
*/
const shellyDevices = require("@devices/shellyDevices.js");
const testdevices = require("@root/test/testdevices.json");

const shellyConnector = require("@devices/shellyConnector.js");

const db = require("@db/db.js");

/** 
  Handles messages sent by the frontend that are related to device management.
  @param {object} msg The message that was sent by the frontend.
*/
function handle(msg, ws) {
  if (msg.event === "devices-get-all") {
    /*
      A dashboard client needs a list of devices.
    */
    const answer = {
      event: msg.event,
      source: "WSDeviceHandler",
      requestID: msg.requestID,
      data: {},
    };

    shellyDevices.getDevices().then((devices) => {
      const userid = msg.data.userid;
      const isTest = msg.data.istest;
      if (isTest && typeof userid === "undefined") {
        //load the testdevices. This is a test and the admin gets them all
        console.log(`Sending only ${testdevices.length} test devices`);
        answer.message = `OK! Here are the ${testdevices.length} test devices`;
        answer.data.devices = testdevices;
        ws.send(JSON.stringify(answer));
      } else {
        if (typeof userid !== "undefined") {
          const sql = `SELECT device_id FROM user_devices WHERE user_id = ?`;
          let userdevices = db.get(sql, [userid]);
          userdevices = userdevices.map((object) => {
            return object.device_id;
          });
          if (isTest) devices = testdevices;

          devices = devices.filter((device) => userdevices.includes(device.id));
          console.log(
            `Sending only the ${devices.length} devices of user ${userid}`,
          );
          answer.message = `OK! Here are the ${devices.length} devices of user ${userid}`;
        } else {
          console.log(`Sending the ${devices.length} devices for an admin`);
          answer.message = `OK! Here are all the ${devices.length} devices`;
        }
        answer.data.devices = devices;
        ws.send(JSON.stringify(answer));
      }
    });
  } else if (msg.event === "device-get") {
    /*
      A dashboard client needs a single device.
    */
    const device = shellyDevices.findDeviceById(msg.data.deviceId);
    if (typeof device === "undefined") {
      console.error(`Device with ID ${msg.data.deviceId} not found`);
      console.error(JSON.stringify(msg));
      return;
    }
    const answer = {
      event: msg.event,
      message: `OK! Here is device ${device.cname}`,
      source: "WSDeviceHandler",
      requestID: msg.requestID,
      data: {
        device,
      },
    };
    ws.send(JSON.stringify(answer));
  } else if (msg.event === "devices-timeline-get") {
    /*
      A dashboard client needs the list of devices.
      And the initial timeline by minutes
    */
    shellyDevices.getDevices().then((devices) => {
      const answer = {
        event: msg.event,
        message: "OK! Here are all the devices and the timeline!",
        source: "WSDeviceHandler",
        requestID: msg.requestID,
        data: {
          devices: devices,
        },
      };
      answer.data.rows = db.select(
        "cByMinute",
        [],
        [],
        [],
        null,
        "device_id, ts",
      );
      ws.send(JSON.stringify(answer));
    });
  } else if (msg.event === "devices-stable-update") {
    /*
      A dashboard client wants to update a device to a stable version.
      Every Device will be updated and a marker is set in the device object.
      A device-update event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.updateStablePending = true;
        device.old_fw_id = device.fw_id;
        device.reloads = 0;
        delete device.notifyFullStatus;
        const updateMessage = {
          event: "device-update",
          eventType: "device",
          source: "WSDeviceHandler",
          message: "Stable update triggered",
          subscriptionID: device.id,
          data: {
            device,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.updateToStable(device);
      }
    }
  } else if (msg.event === "devices-beta-update") {
    /*
      A dashboard client wants to update a device to a beta version.
      Every Device will be updated and a marker is set in the device object.
      A device-update event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.updateBetaPending = true;
        device.old_fw_id = device.fw_id;
        device.reloads = 0;
        delete device.notifyFullStatus;
        const updateMessage = {
          event: "device-update",
          eventType: "device",
          source: "WSDeviceHandler",
          message: "Beta update triggered",
          subscriptionID: device.id,
          data: {
            device,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.updateToBeta(device);
      }
    }
  } else if (msg.event === "devices-reboot") {
    /*
      A dashboard client wants to reboot devices.
      Every Device will be rebooteda and a marker is set in the device object.
      A device-update event is send to the client.
    */
    for (const id of msg.data.ids) {
      const device = shellyDevices.findDeviceById(id);
      if (typeof device !== "undefined") {
        device.rebootPending = true;
        delete device.notifyFullStatus;
        const updateMessage = {
          event: "device-update",
          eventType: "device",
          source: "WSDeviceHandler",
          message: "Reboot triggered",
          subscriptionID: device.id,
          data: {
            device,
          },
        };
        ws.send(JSON.stringify(updateMessage));

        shellyConnector.rebootDevice(device);
      }
    }
  } else if (msg.event === "device-get-wifi-settings") {
    /*
      A dashboard client wants to get the wifi settings of a device.
      The device is identified by its ID.
    */
    const deviceId = msg.data.deviceId;
    const device = shellyDevices.findDeviceById(deviceId);
    if (typeof device !== "undefined") {
      const answer = {
        event: msg.event,
        source: "WSDeviceHandler",
        requestID: msg.requestID,
        message: `OK! Here are the wifi settings of device ${device.cname}`,
        data: {},
      };

      shellyConnector.getWifiSettings(device).then((wifisettings) => {
        answer.data.wifisettings = wifisettings;
        ws.send(JSON.stringify(answer));
      });
    } else {
      console.error(`Device with ID ${deviceId} not found`);
    }
  } else if (msg.event === "device-wifi-update") {
    const updateAnswer = {
      event: msg.event,
      source: "WSDeviceHandler",
      message: "_wifiupdated_",
      requestID: msg.requestID,
      data: {
        success: true,
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
        promises[i](devices[i], msg.data.wifiSettings, result),
      );
    }

    // if the last promise is resolved, send the result to the client
    promise.then((result) => {
      if (result === msg.data.ids.length) {
        updateAnswer.message = "_wifiupdated_";
        updateAnswer.data.success = true;
        updateAnswer.data.total = msg.data.ids.length;
        updateAnswer.data.successful = result;
      } else {
        updateAnswer.message = "_wifinotupdated_";
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
