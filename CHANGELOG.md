### Release v1.0.0

###### 12.01.2025

- Initial Release.

### Release v1.0.1

##### 18.01.2025

**Client (1.0.1)**

- Enhanced debug information
- Updated dependencies

**Server (1.0.1)**

- Updated dependencies

### Release v1.0.2

##### 28.01.2025

**Client (1.0.2)**

- Updated dependencies

**Server (1.0.2)**

- Updated dependencies

### Release v2.0.0

##### 18.06.2025

**Client (2.0.0)**

- Updated dependencies
- Migration to eslint v9, MUI v7, React v19
- fixed a bug that affected the Chart Colors
- fixed a bug the prevented KVS entries to be shown correctly

**Server (2.0.0)**

- (BREAKING) The notifications table was altered. (Delete it, it will be reacreated)
- (BREAKING) Webservices now check for the WS secret (Update your scripts if you use them)
- Updated dependencies
- Using express v5
- fixed the bug that outbound websockets not were enabled if configured
- if configured the Setting of websockets and udp debug automatically reboots the Shelly.
- New feature: Admin can assign devices to users

### Release v2.0.1

##### 02.07.2025

**Client (2.0.1)**

- Vite v7
- fixed: Current Consumption Chart not rerendering

### Release v2.0.2

##### 24.07.2025

**Client (2.0.2)**

- fixed: User could not change his Homepage Setting

**Server (2.0.2)**

- Updated axios because of a security issue

### Release v2.1.0

##### 31.08.2025

**Client (2.1.0)**

- new: (Batch) functions for update, reboot and WIFI settings of devices
- fixed: Error that reset wsmessages when a device was updated-
- fixed: Error that disallowed deleting an created administrator
- fixed: The change of a users role did not enable the save button
- Code refactored for better readability

**Server (2.1.0)**

- fixed: Error that allowed the main admin to delete himself
- fixed: User could not be updated
- Support for RGBW2 (Gen1)
- Code refactored for better readability
- With firmware 1.7.0 UDP log output seems to contain the script ID. Hence `console.log` output is also captured by S-Central
- Supports Firmware 1.7.0. Due to (breaking) changes in the way UDP logs are formatted, Logs and Script Errors are not received with v2.0.2
- Log capturing is now more robust
- Added two example scripts (Example, Watchdog) that demonstrate:
  - how to log output that is captured by the Shellybroker server
  - how to use the webservice endpoints of the Shellybroker
  - how script Errors are detected and send to the Shellybroker as notification

### Release v2.1.1

##### 31.08.2025

**Client (2.1.1)**

- fixed: Firmware updates not working

**Server (2.1.1)**

- new: Available Firmware versions constantly updated from NotifyFullStatus

### Release v2.2.0

##### 24.11.2025

**Client (2.2.0)**

- feature: Added tests with Cypress.
- fixed: Dataloss when switching tabs in ShellyView
- fixed: too many rerenders in ShellyView
