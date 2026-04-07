/**
  Author: André Kreienbring
  Handles websocket messages related to scenes.
*/

const db = require("@db/db.js");
const shellyDevices = require("@devices/shellyDevices.js");
const shellyConnector = require("@devices/shellyConnector.js");
const lodash = require("lodash");

/**
 * Creates a JSON string of the given scene devices, which can be stored in the database.
 * @async
 * @param {string[]} deviceIds - The IDs of the devices that should be included in the scene.
 * @returns {string} The JSON string of the scene devices.
 */
async function createSceneJSON(deviceIds) {
  return shellyDevices.getDevices().then((devices) => {
    const sceneDevices = [];
    for (const device of devices) {
      if (device.switches && deviceIds.includes(device.id)) {
        sceneDevices.push({
          deviceId: device.id,
          switches: device.switches,
        });
      }
    }
    return JSON.stringify(sceneDevices);
  });
}

/** 
  Handles messages sent by the frontend that are related to scene managment.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg, ws) {
  if (msg.event === "scene-create") {
    // the client wants to create a scene with all the devices and their current states.
    const createAnswer = {
      event: msg.event,
      message: "OK, will create the scene.",
      source: "SceneHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const sceneToCreate = msg.data.scene;

    createSceneJSON(msg.data.ids).then((sceneJSON) => {
      try {
        const info = db.insert(
          "scenes",
          {
            name: sceneToCreate.name,
            json: sceneJSON,
            user_id: msg.data.userid,
          },
          false,
        );

        if (info?.changes === 1) {
          createAnswer.data.requestResult.ids = [info.lastInsertRowid];
          const sql = `SELECT id, name FROM scenes`;
          createAnswer.data.scenes = db.get(sql);
        } else {
          console.error(
            `Expected to create 1 scene, but created ${info.changes} scenes.`,
          );
          createAnswer.data.requestResult.success = false;
        }
      } catch (err) {
        console.error(err.message);
        createAnswer.data.requestResult.success = false;
      }

      ws.send(JSON.stringify(createAnswer));
    });
  } else if (msg.event === "scenes-get-all") {
    // the client wants to get all scenes of a specific user.
    const userid = msg.data.userid;
    if (userid) {
      const sql = `SELECT id, name FROM scenes  WHERE user_id = ?`;
      const scenes = db.get(sql, [userid]);
      const getAnswer = {
        event: msg.event,
        message: "OK, here are all the scenes.",
        source: "SceneHandler",
        requestID: msg.requestID,
        data: {
          scenes,
        },
      };
      ws.send(JSON.stringify(getAnswer));
    }
  } else if (msg.event === "scene-select") {
    // the client wants to set a scene, which means that all devices in the scene should be set to the state that is stored in the scene.
    const selectAnswer = {
      event: msg.event,
      message: "OK, will set the scene.",
      source: "SceneHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const sceneid = msg.data.id;
    const sql = `SELECT json FROM scenes WHERE id = ?`;
    const scenes = db.get(sql, [sceneid]);
    if (scenes.length === 1) {
      const sceneDevices = JSON.parse(scenes[0].json);

      for (const sceneDevice of sceneDevices) {
        for (const sceneSwitch of sceneDevice.switches) {
          const device = shellyDevices.findDeviceById(sceneDevice.deviceId);
          if (device) {
            const switchIndex = device.switches.findIndex(
              (sw) => sw.id === sceneSwitch.id,
            );

            sceneSwitch.ts = Math.floor(Date.now()) / 1000; //this helps to avoid raceconditions

            /*
              Identify the switch that should be set by the id and set / update it 
              IF the current state of the switch is different from the state that is stored in the scene.
            */
            if (!lodash.isEqual(device.switches[switchIndex], sceneSwitch)) {
              device.switches[switchIndex] = sceneSwitch;

              shellyConnector.setSwitch(device, sceneSwitch);

              //inform the client about the update of the device.
              const updateMessage = {
                event: "device-update",
                eventType: "device",
                source: "WSSceneHandler",
                message: "Switch was set from a scene",
                subscriptionID: device.id,
                data: {
                  device,
                },
              };
              ws.send(JSON.stringify(updateMessage));
            }
          } else {
            console.error(`Device with ID ${sceneDevice.id} not found.`);
          }
        }
      }

      //send an answer with the ids of the devices that were set.
      selectAnswer.data.requestResult.ids = sceneDevices.map((d) => d.deviceId);
      ws.send(JSON.stringify(selectAnswer));
    }
  } else if (msg.event === "scene-delete") {
    // the client wants to delete a scene.

    const deleteAnswer = {
      event: msg.event,
      message: "OK, will delete the scene.",
      source: "WSSceneHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    try {
      const info = db.del("scenes", ["id"], [msg.data.id]);

      if (info?.changes === 1) {
        const sql = `SELECT id, name FROM scenes`;
        deleteAnswer.data.scenes = db.get(sql);
      } else {
        const errortext = `Expected to delete 1 scene, but deleted ${info.changes} scenes.`;
        console.error(errortext);
        deleteAnswer.data.requestResult.success = false;
        deleteAnswer.data.requestResult.message = errortext;
      }
    } catch (err) {
      console.error(err.message);
      deleteAnswer.data.requestResult.success = false;
      deleteAnswer.data.requestResult.message = err.message;
    }

    ws.send(JSON.stringify(deleteAnswer));
  } else if (msg.event === "scene-update") {
    // the client wants to update a scene. Update the JSON of the scene.
    const updateAnswer = {
      event: msg.event,
      message: "OK, will update the scene.",
      source: "SceneHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    createSceneJSON(msg.data.ids).then((sceneJSON) => {
      try {
        const info = db.update(
          "scenes",
          {
            json: sceneJSON,
          },
          ["id"],
          [msg.data.id],
        );
        if (info?.changes !== 1) {
          console.error(
            `Expected to update 1 scene, but updated ${info.changes} scenes.`,
          );
          updateAnswer.data.requestResult.success = false;
        }
      } catch (err) {
        console.error(err.message);
        updateAnswer.data.requestResult.success = false;
      }

      ws.send(JSON.stringify(updateAnswer));
    });
  }
}

module.exports = {
  handle,
};
