/*
  Author: André Kreienbring
  Utility functions for rules.
*/
const stateOperators = [
  "changedBy", //number only
  "increased", //number only
  "decreased", //number only
  "changed", //does this work for arrays?
  "changedFrom", //enum only
  "changedTo", //enum only
];

/**
 * Uses a recursion to check if the rule has operators that require the stateful rule engine
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @returns {boolean} true if the rule has at least state operator, false otherwise
 */
function hasStateOperator(operators) {
  let result = false;
  const subOperators = [];

  operators.forEach((operator) => {
    Object.entries(operator).forEach(([operatorName, value]) => {
      if (
        operatorName === "and" ||
        operatorName === "or" ||
        operatorName === "not"
      ) {
        //value is an array with all the (sub) operators of the rule
        subOperators.push({ operatorName, value });
      } else {
        //operator !== and, or, not. Check if it is a state operator
        if (stateOperators.includes(operatorName)) {
          result = true;
        }
      }
    });
  });

  subOperators.forEach((subOperator) => {
    const subOperators = subOperator.value;
    //and start the recursion
    result = hasStateOperator(subOperators);
  });

  return result;
}

/**
 * Uses a recursion to check if the rules has the equal operator with "src" as first element of the value array.
 * If so, the second element is the device ID that triggers the rule
 * @param {object[]} operators - The list of operators of the rule with subrules
 * @returns {string} The ID of the device that triggers the rule, or null if none
 */
function getTriggerDeviceId(operators) {
  let result = null;
  const subOperators = [];

  operators.forEach((operator) => {
    Object.entries(operator).forEach(([operatorName, value]) => {
      if (
        operatorName === "and" ||
        operatorName === "or" ||
        operatorName === "not"
      ) {
        //value is an array with all the (sub) operators of the rule
        subOperators.push({ operatorName, value });
      } else {
        //operator !== and, or, not. Check if the operator is "eq" and the value is an array with "src" as first element. If so, the second element is the device ID that triggers the rule
        if (operatorName === "eq" && value[0] === "src") {
          result = value[1];
        }
      }
    });
  });

  subOperators.forEach((subOperator) => {
    const subOperators = subOperator.value;
    //and start the recursion
    result = getTriggerDeviceId(subOperators);
  });

  return result;
}

/**
 * Converts rules, read from the db, to the format that is used on the client side
 * @param {array} dbRules
 * @returns {array} The converted rules
 */
function convertToClientRules(dbRules) {
  const clientRules = dbRules.map((dbRule) => {
    return {
      ruleid: dbRule.ruleid,
      name: dbRule.name,
      description: dbRule.description,
      schemaId: dbRule.schemaId,
      operator: dbRule.operator,
      rule: JSON.parse(dbRule.rule),
      isEnabled: dbRule.isEnabled === 1 ? true : false,
      commandsDevices: JSON.parse(dbRule.commandsDevices),
      createdAt: dbRule.createdAt,
      triggeredAt: dbRule.triggeredAt,
      firstEval: JSON.parse(dbRule.firstEval),
      triggerDeviceId: dbRule.triggerDeviceId,
    };
  });

  return clientRules;
}

module.exports = { hasStateOperator, getTriggerDeviceId, convertToClientRules };
