import { type ArchivedRule } from 'rule-engine-js-ui';

/**
 * SCentralRule extends the ArchivedRule interface to include additional properties specific to the SCentral application.
 * @property {boolean} isEnabled - Indicates if the rule is enabled
 * @property {CommandDeviceType} commandsDevices -  Used to store the commands and devices associated with the rule
 * @property {number} createdAt - Timestamp indicating when the rule was created
 * @property {number} [triggeredAt] - Optional timestamp indicating when the rule was last triggered
 * @property {string} triggeredBy - Identifier of the device that can trigger the rule. This is used to restrict the rule to be triggered only by a specific device.
 */
export interface SCentralRule extends ArchivedRule {
  isEnabled: boolean;
  commandsDevices: CommandDeviceType[];
  createdAt: number;
  triggeredBy: string;
  triggeredAt?: number;
}

/**
 * Used to store the commands and devices associated with the rule. (E.g. command: "turnOn", device: { cname: "light", id: "123" })
 * @property {string} command - The command to be executed on the device
 * @property {{ cname: string; id: string }} device - The device on which the command will be executed, represented by its cname and id
 */
export type CommandDeviceType = {
  command: string;
  device: { cname: string; id: string };
};

/**
 * CommandBuffer is a type that represents a collection of commands, where each command is associated with a string key and a corresponding function.
 * The functions can be of any type, and the keys are used to identify the commands in the buffer.
 * This type is useful for managing a set of commands that can be executed dynamically based on their keys.
 */
export type CommandBuffer = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: Function;
};
