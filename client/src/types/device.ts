/*
  Author: André Kreienbring
  Declares types for devices.
  The type 'Switch' is used in the params part of a Notify(Full)Status websocket message.
*/

type AEnergy = {
  total: number;
  by_minute: number[];
  minute_ts: number;
};

type EmptyObject = Record<PropertyKey, never>;

/*
  Switch of the params part of a Notify(Full)Status websocket message.
*/
export type ParamsSwitch = {
  output: boolean;
  aenergy: AEnergy;
  rgb?: number[];
  brightness?: number;
  white?: number;
};
/*
  The Type of Switch stored in the switches array of a device
*/
export type DeviceSwitch = {
  deviceIP?: string; // added in ShellySwitchList to determine the device
  deviceId?: string; // used for the copy of switch settings
  id: number;
  output: boolean;
  key: string;
  aenergy?: AEnergy;
  rgb?: number[];
  brightness?: number;
  white?: number;
  ts?: number;
  index?: number; // added in ShellySwitchList to determine which switch was toggled
};

/*
  Script of the params part of a Notify(Full)Status websocket message.
*/
export type ParamsScript = { id: number; running: boolean; mem_free: number };

/*
   The Type of Script stored in the scripts array of a device

*/
export type DeviceScript = {
  id: number;
  name: string;
  running: boolean;
  mem_free?: number;
  mem_used?: number;
  mem_peak?: number;
  cpu?: number;
  logmessages?: { ts: number; msg: string }[];
};
/*
  Entry of the KVS array of a device
*/
export type KVSEntry = {
  key: string;
  value: string;
  display?: string;
  style?: string;
};

/*
  Found in the Sys of a Notify(Full)Status websocket message.
*/
type AvailableUpdates =
  | {
      stable: {
        version: string;
      };

      beta: {
        version: string;
      };
    }
  | EmptyObject;

/*
  Found in the params part of a Notify(Full)Status websocket message.
*/
export type Sys = {
  uptime: number;
  ram_free: number;
  fs_free: number;
  restart_required: boolean;
  available_updates: AvailableUpdates;
};

/*
  NotifyEvent, NotifyStatus and NotifyFullStatus have a Param object
*/
export type Params = {
  [key: `switch:${number}`]: ParamsSwitch | undefined;
  [key: `rgbw:${number}`]: ParamsSwitch | undefined;
  [key: `script:${number}`]: ParamsScript | undefined;
  cloud?: { connected: boolean };
  mqtt?: { connected: boolean };
  matter?: { num_fabrics: number };
  ws?: { connected: boolean };
  events?: Event[];
  sys?: Sys;
  ts: number;
  'switch:0'?: ParamsSwitch;
  'switch:1'?: ParamsSwitch;
  'switch:2'?: ParamsSwitch;
  'switch:3'?: ParamsSwitch;
  'script:1'?: ParamsScript;
  'script:2'?: ParamsScript;
  'script:3'?: ParamsScript;
  'rgbw:0'?: ParamsSwitch;
};

/*
  Used when the consumption of a device is calculated
*/
export type DeviceConsumption = {
  hasSwitch: boolean;
  totalPower: number;
  powerPerDevice: { label: string; value: number }[];
};

/*
  Device status messages 
*/
export type NotifyFullStatus = {
  params: Params;
  method: string;
};

export type NotifyStatus = {
  params: Params;
  method: string;
};

export type NotifyEvent = {
  params: Params;
  method: string;
};

/*
  Events of a NotifyEvent status message
*/
export type Event = {
  id?: number;
  component: string;
  event: string;
  data?: {
    motion?: number;
    window?: number;
    button?: number;
  };
  time_ms?: number;
  ts: number;
};

/*
  Used for generation of (Icon) information extracted from status messages.
  Also for the update of device values.
*/
export type DeviceNotifyMessages = {
  [key: string]: NotifyFullStatus | NotifyStatus | NotifyEvent | undefined;
  notifyFullStatus?: NotifyFullStatus;
  notifyStatus?: NotifyStatus;
  notifyEvent?: NotifyEvent;
};

/*
  Devices (send by the server) have these properties
*/
export type Device = {
  id: string;
  ip: string;
  name: string;
  cname: string;
  gen: number;
  chartColor?: string;
  scripts: DeviceScript[];
  switches: DeviceSwitch[];
  kvs: KVSEntry[];
  online: boolean;
  image: string;
  fw_id: string;
  notifyFullStatus?: NotifyFullStatus;
  notifyStatus?: NotifyStatus;
  notifyEvent?: NotifyEvent;
  stable?: string;
  beta?: string;
  rebootPending?: boolean;
  updateBetaPending?: boolean;
  updateStablePending?: boolean;
  reloads?: number;
};

/**
  Tabpanel buffers all devices with their last update timestamp. This index signature is used
  to access buffered devices by the deviceId (string).
 */
export type DeviceLastUpdateBuffer = {
  [key: string]: { ts: number; device: Device };
};

/*
  These properties are retrieved from a Notify(Full)Status and
  are displayed in the Dashboard incl. the charts
*/
export type DashboardValues = {
  currentPower: number;
  powerPerDevice: { label: string; value: number }[];
  colorPerDevice: string[];
  scriptsRunning: number;
  scriptsCount: number;
  cloudCount: number;
  onlineCount: number;
};

/*
  Used in the ShellyView for sorting devices
*/
export type SortOption = 'config' | 'gen' | 'cname' | 'name';

/*
  Action for Devices in the Shelly Table / List
*/
export type ShellyTableAction = 'reboot' | 'stable' | 'beta' | 'wifi';

/*
  Used in the ShellyView for filtering devices
*/
export type DeviceFilters = {
  name: string[];
  gen: string[];
};

export type Filter = {
  models: string[];
  generations: string[];
  mChecked: boolean[];
  gChecked: boolean[];
  isFilter: boolean;
  deviceFilters: DeviceFilters;
};

/*
  Displays information to the user when running batch tasks (e.g. update, rebooot)
*/
export type BatchAlert = {
  open?: boolean;
  text: string;
  severity: 'info' | 'success' | 'error' | 'warning';
  visible: boolean;
  title: string;
};

/*
  Used in the shelly table to display / update Wifi settings
*/
export type WifiSettings = {
  ssid: string;
  password: string;
  ip?: string;
  ipv4mode?: string;
  gw?: string;
  netmask?: string;
  nameserver?: string;
};

/*
  Device information shown in the shelly table
  TODO: sync this with the device type?
*/
export type DeviceTableRow = {
  id: string;
  name: string;
  model: string;
  gen: number;
  image: string;
  firmware: string;
  stable?: string;
  beta?: string;
  rebootPending?: boolean;
  updateBetaPending?: boolean;
  updateStablePending?: boolean;
  reloads?: number;
  uptime: number;
  restart: string | boolean | undefined;
};

/*
  Used to copy settings from one device switch to another
*/
export type SwitchCopySource = {
  deviceId: string;
  deviceName: string;
  aSwitch: DeviceSwitch;
};
