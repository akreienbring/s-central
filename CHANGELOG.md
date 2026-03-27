### Release v2.4.0

##### 27.03.2026

**Client (2.4.0)**

- Migrated to Typescript
- feature: Minimize the cards in the Script/KVS Tab
- feature: Start and stop scripts directly from the overview of devices
- feature: Show server- and client version in nav bar. ATTENTION: index.html has changed!
- feature: Highlight specific parts of a WS message from a device when the icon is clicked
- feature: Delete all notifications at once
- feature: Show websocket, matter and mqtt status in WSInspector
- fixed: more precise script and switch status by using NotifyStatus for Gen2+ devices
- fixed: List/Batch table not filtered/sorted

**Server (2.4.0)**

- feature: Start and stop scripts directly from the overview of devices
- feature: Setting a device to offline, if there's no response to a status request for 3 min.
- feature: Added an 'Error' script example, that can be used to test the script error notification.
- feature: Start the server as 'Test' server to enable cypress tests to create data.
- fixed: more precise script and switch status by using NotifyStatus for Gen2+ devices
- fixed: wrong available firmware updates of Gen1 devices
- fixed: Available firmware updates only correct after server restart
- fixed: Adding unnecessary auth header to status request
- fixed: Sending an script error notification, if the script was stopped manually

### Release v2.3.0

##### 13.01.2026

**Client (2.3.0)**

- feature: Click on a KVS entry to go to the corresponding webpage
- feature: Using more MUI colors (72) for the comsumption charts
- feature: Copy device controls (eg. white, brightness, rgb) from one device to another
- feature: Display the number of device reloads after a firmware update
- feature: Timeline now shows consumption gaps (null values) in Minute chart
- fixed: Password visible in local storage after credentials update
- fixed: Wrong user data when reconnecting an previously connected user
- fixed: Unwanted navigation to user home after profile update
- fixed: Showing wrong tooltip when hovering over charts
- fixed: Blog entries could not be expanded to show the full text
- fixed: Wrong devices display when using filter and sort together
- fixed: Too many unnessesary requests send to server, when tab changes or filter / sort was used
- fixed: Switch and Script status not updated from wsmessage
- fixed: Script status not changed when it was stopped by an error
- fixed: Incorrect chart data in timeline by minute because of missing null values

**Server (2.3.0)**

- feature: Limit the number of device reloads after a firmware update to 5
- fixed: Removed unnessesary Server configuraration (http-server.host)
- fixed: An update to a beta version was not handled correctly
- fixed: Wrong log (update successful) when a device was offline and reloaded
- fixed: Script status not updated on the server side from wsmessage

### Release v2.2.1

##### 01.12.2025

**Client (2.2.1)**

- fixed: Problem with automatic Logins
- fixed: Password2 visible in local storage after credentials update

**Server (2.2.1)**

- fixed: When logging in with a non existant user "Wrong Password" was returned

### Release v2.2.0

##### 24.11.2025

**Client (2.2.0)**

- feature: Added tests with Cypress.
- fixed: Dataloss when switching tabs in ShellyView
- fixed: too many rerenders in ShellyView

### Release v2.1.1

##### 31.08.2025

**Client (2.1.1)**

- fixed: Firmware updates not working

**Server (2.1.1)**

- new: Available Firmware versions constantly updated from NotifyFullStatus

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

### Release v2.0.2

##### 24.07.2025

**Client (2.0.2)**

- fixed: User could not change his Homepage Setting

**Server (2.0.2)**

- Updated axios because of a security issue

### Release v2.0.1

##### 02.07.2025

**Client (2.0.1)**

- Vite v7
- fixed: Current Consumption Chart not rerendering

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

### Release v1.0.2

##### 28.01.2025

**Client (1.0.2)**

- Updated dependencies

**Server (1.0.2)**

- Updated dependencies

### Release v1.0.1

##### 18.01.2025

**Client (1.0.1)**

- Enhanced debug information
- Updated dependencies

**Server (1.0.1)**

- Updated dependencies

### Release v1.0.0

###### 12.01.2025

- Initial Release.
