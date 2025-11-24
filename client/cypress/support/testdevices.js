/*
  Author: André Kreienbring
  This test devices will be used for e2e testing of the Shellies page.
  The test device must be a Gen2 that is shown on every tab of the Shellies page.
*/
export const testDevices = [
  {
    ip: '192.168.68.20',
    cname: 'Test',
    password: 'test',
    online: true,
    name: 'PlusRGBWPM',
    gen: 2,
    fw_id: '20250924-062733/1.7.1-gd336f31',
    id: 'shellyplusrgbwpm-30c92257d20c',
    image: '/assets/images/devices/PlusRGBWPM.png',
    wsmessages: {
      NotifyStatus: {
        src: 'shellyplusrgbwpm-30c92257d20c',
        dst: 'ws',
        method: 'NotifyStatus',
        params: {
          ts: 1763563860,
          'rgbw:0': {
            aenergy: {
              by_minute: [0, 0, 0],
              minute_ts: 1763563860,
              total: 3102,
            },
          },
        },
      },
      NotifyEvent: {
        src: 'shellyplusrgbwpm-30c92257d20c',
        dst: 'ws',
        method: 'NotifyEvent',
        params: {
          ts: 1763563594.65,
          events: [
            {
              component: 'sys',
              event: 'scheduled_restart',
              time_ms: 997,
              ts: 1763563594.65,
            },
          ],
        },
      },
      NotifyFullStatus: {
        src: 'shellyplusrgbwpm-30c92257d20c',
        dst: 'request',
        method: 'NotifyFullStatus',
        params: {
          ble: {},
          cloud: {
            connected: true,
          },
          'input:0': {
            id: 0,
            state: null,
          },
          'input:1': {
            id: 1,
            state: null,
          },
          'input:2': {
            id: 2,
            state: null,
          },
          'input:3': {
            id: 3,
            state: null,
          },
          mqtt: {
            connected: false,
          },
          plusrgbwpm: {},
          'rgbw:0': {
            id: 0,
            source: 'init',
            output: false,
            rgb: [255, 255, 255],
            brightness: 10,
            white: 0,
            temperature: {
              tC: 48.2,
              tF: 118.7,
            },
            aenergy: {
              total: 3102,
              by_minute: [0, 0, 0],
              minute_ts: 1763563800,
            },
            apower: 0,
            current: 0,
            voltage: 24.6,
          },
          'script:1': {
            id: 1,
            running: true,
            mem_used: 784,
            mem_peak: 1652,
            mem_free: 22974,
            cpu: 0,
          },
          'script:2': {
            id: 2,
            running: true,
            mem_used: 1414,
            mem_peak: 3192,
            mem_free: 22974,
            cpu: 0,
          },
          sys: {
            mac: '30C92257D20C',
            restart_required: false,
            time: '15:50',
            unixtime: 1763563834,
            last_sync_ts: 1763563717,
            uptime: 121,
            ram_size: 249200,
            ram_free: 119908,
            ram_min_free: 112248,
            fs_size: 393216,
            fs_free: 98304,
            cfg_rev: 255,
            kvs_rev: 4,
            schedule_rev: 0,
            webhook_rev: 0,
            btrelay_rev: 0,
            available_updates: {},
            reset_reason: 4,
            utc_offset: 3600,
          },
          wifi: {
            sta_ip: '192.168.68.20',
            status: 'got ip',
            ssid: 'Tropired2709',
            bssid: '32:16:9d:2f:f7:ca',
            rssi: -47,
          },
          ws: {
            connected: true,
          },
          ts: 1763563833,
        },
      },
    },
    scripts: [
      {
        id: 1,
        name: 'Example',
        enable: true,
        running: true,
        logmessages: [
          {
            ts: 1763563688,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
          {
            ts: 1763563744,
            msg: 'Example (#1): Please participate and help the project become better!\u0000',
          },
          {
            ts: 1763563744,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
          {
            ts: 1763563774,
            msg: 'Example (#1): Please participate and help the project become better!\u0000',
          },
          {
            ts: 1763563774,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
          {
            ts: 1763563804,
            msg: 'Example (#1): Please participate and help the project become better!\u0000',
          },
          {
            ts: 1763563804,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
          {
            ts: 1763563834,
            msg: 'Example (#1): Please participate and help the project become better!\u0000',
          },
          {
            ts: 1763563834,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Example (#1): Please participate and help the project become better!\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Looks like with Firmware 1.7.0 messages without prefix can also be captured\u0000',
          },
        ],
      },
      {
        id: 2,
        name: 'Watchdog',
        enable: true,
        running: true,
        logmessages: [
          {
            ts: 1763563864,
            msg: 'Watchdog (#2): result: {"id":1,"running":true,"mem_used":784,"mem_peak":1652,"mem_free":22610,"cpu":0}\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Watchdog (#2): error_code: 0\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Watchdog (#2): error_message:\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Watchdog (#2): userdata: {"report":true,"error_msg":"Could not get the status of Script Example","success_msg":"Successfully got\u0000',
          },
          {
            ts: 1763563864,
            msg: 'the status of Script Example","sScriptname":"Example","nScriptIndex":0,"nID":1,"sIP":"192.168.68.20"}\u0000',
          },
          {
            ts: 1763563864,
            msg: 'Watchdog (#2): Successfully got the status of Script Example\u0000',
          },
          {
            ts: 1763563864,
            msg: "Script 'Example' is running",
          },
        ],
      },
    ],
    kvs: [
      {
        key: 'ClimateControl',
        value: '1',
        display: 'Klimakontrolle',
        style: 'color',
      },
    ],
    switches: [
      {
        deviceIp: '192.168.68.20',
        deviceId: 'shellyplusrgbwpm-30c92257d20c',
        key: 'rgbw:0',
        id: 0,
        output: false,
        brightness: 10,
        white: 0,
        rgb: [255, 255, 255],
      },
    ],
  },
];
