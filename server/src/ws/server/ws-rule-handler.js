/**
  Author: André Kreienbring
  Handles websocket messages related with rules.
  see: https://github.com/crafts69guy/rule-engine-js
*/

const db = require("@db/db.js");
const { createRuleEngine, StatefulRuleEngine } = require("rule-engine-js");
const ruleCommands = require("./rule-commands.js");
const ruleUtils = require("@utils/rule-utils.js");

const ruleEngine = createRuleEngine();
const statefulEngine = new StatefulRuleEngine(ruleEngine, {
  triggerOnEveryChange: true,
  storeHistory: true,
});

let rulesArray = [];
let rulesObject = {};
const getAllRules = `SELECT rules.id AS ruleid, name, description, schemaId, operator, rule, isEnabled, commandsDevices, createdAt, triggeredAt, firstEval, triggerDeviceId FROM rules ORDER BY id`;

/**
 * When a rule was successfully tested with a given  object, this function triggers the commands that were associated with the rule.
 * and sends an update to the clients with the information that the rule was triggered.
 * @param {object} clientRule - A rule that was already converted to the format that is used on the client side
 * @param {Function} broadcast - A function, received from WSHandler, to broadcast a message to all websocket clients
 */
function triggerCommands(clientRule, broadcast) {
  const commandsDevices = clientRule.commandsDevices;
  commandsDevices.forEach((commandDevice) => {
    const command = commandDevice.command;
    const deviceId = commandDevice.device.id;
    const theFunction = ruleCommands[command];
    theFunction(deviceId);
  });

  // update the triggeredAt timestamp of the rule in the database and in the rules array
  const now = Date.now();
  db.update("rules", { triggeredAt: now }, ["id"], [clientRule.ruleid]);
  clientRule.triggeredAt = now;

  /*
    Send a message to the client to update the rule list, so that the new triggeredAt timestamp is displayed
    Need to send all rules, because the client is not able to handle quick incoming state changes when more then one rule is triggered
  */
  const updateMessage = {
    event: "rule-update",
    eventType: "rule",
    source: "WSRuleHandler",
    message: "Rule triggered",
    subscriptionID: clientRule.ruleid,
    data: {
      rules: rulesArray,
    },
  };
  broadcast(updateMessage);
}

/**
 * Loads all rules from the database and stores them in the rules array.
 * This way we have the current rules in memory and can check them when a new status is received from the devices.
 */
function loadRules() {
  rulesArray = [];
  rulesObject = {};

  const dbRules = db.get(getAllRules);
  const clientRules = ruleUtils.convertToClientRules(dbRules);

  clientRules
    .filter((clientRule) => clientRule.isEnabled)
    .forEach((clientRule) => {
      const operators = clientRule.rule[clientRule.operator];
      const hasStateOperator = ruleUtils.hasStateOperator(operators);

      if (hasStateOperator) {
        //reset the state of the rule, because this must be the first evaluation
        statefulEngine.clearState(clientRule.ruleid.toString());
        statefulEngine
          .evaluate(
            clientRule.ruleid.toString(),
            clientRule.rule,
            clientRule.firstEval,
          )
          .then((testResult) => {
            console.log(
              `Rule ${clientRule.name} with id ${clientRule.ruleid} was evaluated for the first time. Result: ${JSON.stringify(testResult)}`,
            );
          });

        //add the rule to the rulesObject for later batch evaluation of all rules with state operators
        rulesObject[clientRule.ruleid.toString()] = clientRule.rule;
      }

      rulesArray.push(clientRule);
    });
}

/**
 * CURRENTLY NOT USED. Because rules related to NotifyStatus requiere that we only check rules that are
 * have the "equals deviceId" operator set. Hence can not be evaluated in one batch.
 * Left here for future use, when we have more than one status update that can trigger rules.
 * Checks if any rules are triggered by the received status update.
 * Called from wsHandler when a new status update is received from the devices.
 * @param {object} notifyStatus - The status update received from the device.
 * @param {object} device - The device that send the message
 * @param {function} broadcast - A function from WSHandler used to send messages to all ws clients.
 */
function evaluateRulesBatch(notifyStatus, device, broadcast) {
  if (rulesArray.length === 0) return;

  const hasSwitch = device?.switches;
  if (typeof hasSwitch === "undefined") {
    console.error(`RuleHandler received Device without switches: ${device}`);
    return;
  }

  //currently only the first switch is supported
  const switchKey = device?.switches[0]?.key;
  const output = notifyStatus.params[switchKey]?.output;

  if (typeof switchKey !== "undefined" && typeof output !== "undefined") {
    /*
       Due to this bug: https://github.com/crafts69guy/rule-engine-js/issues/11
       nested objects can't be used with stateful operators. 
       Therefor we need to flatten the notififyStatus to trigger the rules!
    */

    const flatNotifiyStatus = {
      src: notifyStatus.src,
      output,
    };

    console.error(
      `Checking rules (as batch) for Device ${device.cname}, Switch ${switchKey}  and NotifiyStatus: ${JSON.stringify(flatNotifiyStatus)}`,
    );

    statefulEngine
      .evaluateBatch(rulesObject, flatNotifiyStatus, {
        stopOnError: false, // Continue processing all rules even if one fails
        collectErrors: true, // Gather detailed error information
      })
      .then((evalResults) => {
        Object.entries(evalResults.results).forEach(([ruleid, result]) => {
          if (!Number.isNaN(ruleid)) {
            const clientRule = rulesArray.find(
              (rule) => rule.ruleid.toString() === ruleid,
            );
            console.log(
              `Rule ${clientRule.name} with id ${clientRule.ruleid} evaluated to ${JSON.stringify(result.success)}`,
            );

            if (result.success) {
              triggerCommands(clientRule, broadcast);
            } else {
              console.log(
                `Result: Rule ${clientRule.name} with id ${clientRule.ruleid}: ${JSON.stringify(result.details)}`,
              );
              const history = statefulEngine.getHistory(ruleid);
              console.log(
                `History for Rule ${clientRule.name} with id ${clientRule.ruleid}: ${JSON.stringify(history)}`,
              );
            }
          }
        });
      });
  }
}

/**
 * Checks if any rules are triggered by the received status update.
 * Called from wsHandler when a new status update is received from the devices.
 * @param {object} notifyStatus - The status update received from the device.
 * @param {object} device - The device that send the message
 * @param {function} broadcast - A function from WSHandler used to send messages to all ws clients.
 */
function evaluateRules(notifyStatus, device, broadcast) {
  if (rulesArray.length === 0) return;

  /*
    Check if the message is a status update that can trigger rules.
    Use NotifyStatus because it's immediatly received when the stats changes
    Currently there is only a NotifyStatus Schema (stored on the client side) witch uses the output value of a device
  */
  const hasSwitch = device?.switches;
  if (typeof hasSwitch === "undefined") {
    console.error(`RuleHandler received Device without switches: ${device}`);
    return;
  }

  //currently only the first switch is supported
  const switchKey = device?.switches[0]?.key;
  const output = notifyStatus.params[switchKey]?.output;

  if (typeof switchKey !== "undefined" && typeof output !== "undefined") {
    /*
       Due to this bug: https://github.com/crafts69guy/rule-engine-js/issues/11
       nested objects can't be used with stateful operators. 
       Therefor we need to flatten the notififyStatus to trigger the rules!
    */

    const flatNotifiyStatus = {
      src: notifyStatus.src,
      output,
    };

    console.log(
      `Checking rules for Device ${device.cname}, Switch ${switchKey}  and NotifiyStatus: ${JSON.stringify(flatNotifiyStatus)}`,
    );

    rulesArray.forEach((clientRule) => {
      const operators = clientRule.rule[clientRule.operator];
      const hasStateOperator = ruleUtils.hasStateOperator(operators);

      if (!hasStateOperator) {
        console.log("Using normal rule engine");

        const testResult = ruleEngine.evaluateExpr(
          clientRule.rule,
          flatNotifiyStatus,
        );

        /*
            check if the rule condition is fulfilled by the received status update
            if so, execute the command / device combination that is stored in the rule
          */
        console.log(
          `Rule ${clientRule.name} with id ${clientRule.ruleid} evaluated to ${JSON.stringify(testResult)}`,
        );
        if (testResult.success) {
          triggerCommands(clientRule, broadcast);
        }
      } else {
        /*
          IMPORTANT: Currently rules based on the NotifyStatus can only be evaluated if the rule has the "equals deviceId" operator set.
          Because the stateful rule engine is used, we can not evaluate all rules in one batch, because the state of the rules is stored 
          in the stateful rule engine and we can not reset the state if it is triggered by another device.
          Hence we need to check if the rule has the "eq 'src'" operator set and if so, we can evaluate it.
        */
        if (
          clientRule.triggerDeviceId !== null &&
          clientRule.triggerDeviceId !== notifyStatus.src
        ) {
          console.log(
            `Skipping rule ${clientRule.name} with id ${clientRule.ruleid} because it is triggered by device ${clientRule.triggerDeviceId} and not by device ${notifyStatus.src} (${device.cname})`,
          );
          return;
        }

        statefulEngine
          .evaluate(
            clientRule.ruleid.toString(),
            clientRule.rule,
            flatNotifiyStatus,
          )
          .then((testResult) => {
            console.log("Using stateful rule engine");
            console.log(
              `Rule ${clientRule.name} with id ${clientRule.ruleid} evaluated to ${JSON.stringify(testResult)}`,
            );
            if (testResult.success) {
              triggerCommands(clientRule, broadcast);
            }
          });
      }
    });
  }
}

/** 
  Handles messages sent by the frontend that are related to rule managment.
  @param {object} msg The message that was sent by the frontend.
  @returns {object} The (answer) message that will be send to the client
*/
function handle(msg) {
  if (msg.event === "rules-get-all") {
    const rulesAnswer = {
      event: msg.event,
      message: "OK! Here are all the rules",
      source: "RulesHandler",
      requestID: msg.requestID,
      data: {},
    };

    const dbRules = db.get(getAllRules);
    //convert the db rules to objects that can be used on the client side

    rulesAnswer.data.rules = ruleUtils.convertToClientRules(dbRules);

    return rulesAnswer;
  } else if (msg.event === "rule-create") {
    const createAnswer = {
      event: msg.event,
      message: "OK, going to create the Rule",
      source: "RulesHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
        },
      },
    };

    const ruleToCreate = msg.data.rule;
    const operators = ruleToCreate.rule[ruleToCreate.operator];
    const triggerDeviceId = ruleUtils.getTriggerDeviceId(operators);

    let info;
    try {
      info = db.insert(
        "rules",
        {
          name: ruleToCreate.name,
          description: ruleToCreate.description,
          schemaId: ruleToCreate.schemaId,
          operator: ruleToCreate.operator,
          rule: JSON.stringify(ruleToCreate.rule),
          isEnabled: ruleToCreate.isEnabled ? 1 : 0,
          commandsDevices: JSON.stringify(ruleToCreate.commandsDevices),
          createdAt: ruleToCreate.createdAt,
          firstEval: JSON.stringify(ruleToCreate.firstEval),
          triggerDeviceId: triggerDeviceId || null,
        },
        false,
      );

      if (info?.changes !== 1) {
        console.error(
          `Expected to create 1 rule, but created ${info.changes} rules.`,
        );
        createAnswer.data.requestResult.success = false;
      } else {
        loadRules();
        createAnswer.data.rules = ruleUtils.convertToClientRules(
          db.get(getAllRules),
        );
      }
    } catch (err) {
      console.error(err.message);
      createAnswer.data.requestResult.success = false;
    }

    return createAnswer;
  } else if (msg.event === "rule-delete") {
    const deleteAnswer = {
      event: msg.event,
      message: "Rule deleted",
      source: "RuleHandler",
      requestID: msg.requestID,
      data: {},
    };

    const searches = new Array(msg.data.ids.length).fill("id");
    db.del("rules", searches, msg.data.ids, "OR");

    const dbRules = db.get(getAllRules);
    deleteAnswer.data.rules = ruleUtils.convertToClientRules(dbRules);
    loadRules();
    return deleteAnswer;
  } else if (msg.event === "rule-update") {
    const ruleToUpdate = msg.data.rule;

    const operators = ruleToUpdate.rule[ruleToUpdate.operator];
    const triggerDeviceId = ruleUtils.getTriggerDeviceId(operators);

    const updateAnswer = {
      event: msg.event,
      message: "OK, going to update the Rule",
      source: "RuleHandler",
      requestID: msg.requestID,
      data: {
        requestResult: {
          success: true,
          id: ruleToUpdate.ruleid,
        },
      },
    };

    try {
      const info = db.update(
        "rules",
        {
          name: ruleToUpdate.name,
          description: ruleToUpdate.description,
          schemaId: ruleToUpdate.schemaId,
          operator: ruleToUpdate.operator,
          rule: JSON.stringify(ruleToUpdate.rule),
          isEnabled: ruleToUpdate.isEnabled ? 1 : 0,
          commandsDevices: JSON.stringify(ruleToUpdate.commandsDevices),
          createdAt: ruleToUpdate.createdAt,
          firstEval: JSON.stringify(ruleToUpdate.firstEval),
          triggerDeviceId: triggerDeviceId || null,
        },
        ["id"],
        [ruleToUpdate.ruleid],
      );
      if (info.changes !== 1) {
        console.error(
          `Expected to update 1 rule, but updated ${info.changes} rules.`,
        );
        updateAnswer.data.requestResult.success = false;
      } else {
        updateAnswer.data.requestResult.id = ruleToUpdate.ruleid;
        loadRules();
      }
    } catch (err) {
      console.error(err.message);
      updateAnswer.data.requestResult.success = false;
    }
    return updateAnswer;
  }
}

module.exports = {
  handle,
  evaluateRules,
  evaluateRulesBatch,
  loadRules,
};
