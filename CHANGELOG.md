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

### Release v2.0.0 (WORK IN PROGRESS!!!)
##### 18.01.2025
**Client (2.0.0)**
- Updated dependencies
- Migration to eslint v9, MUI v7, React v19
- fixed a bug that affected the Chart Colors
- fixed a bug the prevented KVS entries to be shown correctly

**Server (2.0.03)**
- (BREAKING) The notifications table was altered. (Delete it, it will be reacreated)
- (BREAKING) Webservices now check for the WS secret (Update your scripts if you use them)
- Updated dependencies
- Using express v5
- fixed the bug that outbound websockets not were enabled if configured
- if configured the Setting of websocketes and udp debug automatically reboots the Shelly.
- New feature: Admin can assign devices to users




