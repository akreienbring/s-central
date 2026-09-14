/*
  Author: André Kreienbring
  A table of rules. With all the functionality to create and edit them.
  Concept:
  - Schemas und Commands are made available on the client side for the user in RuleEngineJSUI to create a rule.
  - The rules are stored on the server and therefor the server has access to the schema and the command / device combination they contain.
  - IF e.g. a NotifyStatus schema is used in a rule, the server can listen to the NotifyStatus and check if the rule condition is fulfilled. 
  - If so, the server can execute the command / device combination that is stored in the rule.
  - This way schamas and commands must not be stored in the DB, but can be dynamically added to the system and used in the rules.
  - The commands must correspond to the commands that are used in the Shelly Broker to control the devices. 
  - The server can then execute the command by sending a message to the Shelly Broker with the corresponding command and device id.
*/
import type { Device } from '@src/types/device';
import type { Subscription } from '@src/types/context';
import type { SCentralRule, CommandDeviceType } from '@src/types/rule';

import { useTranslation } from 'react-i18next';
import { createUUID } from '@src/utils/general';
import { publishEvent } from '@src/events/pubsub';
import { useShelly } from '@src/hooks/use-shelly';
import { emptyRows, getComparator } from '@src/utils/sort-array';
import { useRef, type JSX, useState, useEffect, useCallback } from 'react';
import {
  type Addon,
  RuleEngineJSUI,
  type InputSchema,
  type ArchivedRule,
  type CustomLabels,
} from 'rule-engine-js-ui';

import {
  Card,
  Table,
  Stack,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import TableNoData from '../table-no-data';
import RuleTableRow from '../rule-table-row';
import CommandDevice from '../command-device';
import RuleTableHead from '../rule-table-head';
import TableEmptyRows from '../table-empty-rows';
import RuleTableToolbar from '../rule-table-toolbar';
import { applyRuleFilter } from '../rule-table-utils';
import NotifyStatus from '../schemas/NotifyStatus.json';

//----------------Create the list of commands the user can select.
const commands = ['TurnOFF', 'TurnON'];

/**
 * Offers functions to create, save end edit rules used for automation
 * @returns {JSX.Element}
 */
export default function RuleView(): JSX.Element | null {
  const { t } = useTranslation();
  const { request, isTest, subscribe, unsubscribe } = useShelly();
  const [archivedRules, setArchivedRules] = useState<SCentralRule[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [isOpenRule, setIsOpenRule] = useState<{
    open: boolean;
    rule?: SCentralRule;
  }>({
    open: false,
    rule: undefined,
  });
  const [commandsDevices, setCommandsDevices] = useState<CommandDeviceType[]>([]);
  const [isRulesLoaded, setIsRulesLoaded] = useState(false);
  const [isDevicesLoaded, setIsDevicesLoaded] = useState(false);
  const [schemas, setSchemas] = useState<InputSchema[]>([]);
  const subscriptionID = useRef(createUUID());

  /*
    Custom Labels can be used to translate the Simple UI
  */
  const customLabels: CustomLabels = {
    dialogTitleNew: t('_newrule_'),
    dialogTitleUpdate: t('_updaterule_'),
    trigger: t('_rui_trigger_'),
    selectSchema: t('_rui_selectSchema_'),
    selectLogic: t('_rui_selectLogic_'),
    logicValues: [t('All'), t('One'), t('None')],
    addNameDescription: t('_rui_addNameDescription_'),
    nameLabel: t('Name'),
    descriptionLabel: t('Description'),
    saveRule: t('Save'),
    updateRule: t('Update'),
    saveInfo: t('_rui_saveInfo_'),
    updateInfo: t('_rui_updateInfo_'),
    saveButton: t('Save'),
    updateButton: t('Update'),
    cancelButton: t('Cancel'),
  };

  /**
   * Will be called when devices were received via websocket from shellybroker.
   * It sets the received devices in the state and also creates a first entry
   * in the commandsDevices array. This will be used as a preset in the Create Rule Dialog.
   * Also the devices are added to the existing schma(s).
   * @param {SrvAnswerMsg} msg The message with a 'devices-get-all' event.
   */
  const handleDevicesReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      if (typeof msg.data.devices !== 'undefined') {
        const msgDevices = msg.data.devices;
        setDevices(msgDevices);

        // preset the first command / device combination in the addon
        const newCommandsDevices: CommandDeviceType[] = [...commandsDevices];
        newCommandsDevices.push({
          command: commands[0],
          device: { cname: msgDevices[0].cname, id: msgDevices[0].id },
        });
        setCommandsDevices(newCommandsDevices);

        /* 
          Add all devices GEN2+ to the schema. (Gen1 devices don't support the NotifyStatus))
          Because the src field is an JSON Schema enum, the user can select a Device.
        */
        const gen2DeviceEnum = msgDevices
          .filter((device: Device) => device.gen > 1)
          .map((device: Device) => ({
            name: device.cname,
            value: device.id,
          }));

        NotifyStatus.properties.src.enum = gen2DeviceEnum;
        const newSchemas = [
          {
            name: 'Notify Status',
            description: 'Notify Status',
            jsonSchema: NotifyStatus,
            schemaId: 1,
          },
        ] as InputSchema[];
        setSchemas(newSchemas);
        setIsDevicesLoaded(true);
      }
    },
    [commandsDevices]
  );

  /**
   * Will be called when rules were received via websocket from shellybroker.
   * It sets the received rules  in the state
   * @param {SrvAnswerMsg} msg The message with a 'devices-get-all' event.
   */
  const handleRulesReceived = useCallback((msg: SrvAnswerMsg) => {
    if (typeof msg.data.rules !== 'undefined') {
      setArchivedRules(msg.data.rules);
      setRowCount(msg.data.rules.length);
      setIsRulesLoaded(true);
    }
  }, []);

  /**
    CURRENTY UNUSED Not working when more then one rule is triggered. State changes to quick?
    Called after a rule was updated on the server side (e.g. triggered).
    @param {object} msg The message with a rule update.
  */
  /*
  const handleRuleUpdateEvent = useCallback(
    (msg: SrvEventMsg) => {
      if (typeof msg.data.rule !== 'undefined') {
        const rule = msg.data.rule;
        const updatedRules = [...archivedRules];
        const ruleIndex = updatedRules.findIndex((r) => r.ruleid === rule.ruleid);
        if (ruleIndex !== -1 && typeof rule.triggeredAt !== 'undefined') {
          console.log(
            `Updating rule ${rule.name} tiggeredAt: ${fDateTime(rule.triggeredAt, 'dd MMM HH:mm')}`
          );

          updatedRules[ruleIndex] = rule;
          setArchivedRules(updatedRules);
        }
      }
    },
    [archivedRules]
  );
*/
  /**
    Called after a rule was updated on the server side (e.g. triggered).
    Used instead of handleRuleUpdateEvent because to many quick state changes don't update the archivedRules correctly
    @param {object} msg The message with a rule update.
  */
  const handleRulesUpdated = useCallback((msg: SrvEventMsg) => {
    if (typeof msg.data.rules !== 'undefined') {
      setArchivedRules(msg.data.rules);
    }
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    Upon mounting the RuleView it sends a request for all devices and rules to the server. 
  */
  useEffect(() => {
    if (!isDevicesLoaded) {
      const deviceRequestMsg: CliRequestMsg = {
        event: 'devices-get-all',
        source: 'RuleView',
        message: 'UserView needs the list of devices',
        data: {
          istest: isTest,
        },
      };
      request(deviceRequestMsg, handleDevicesReceived);
    }

    if (!isRulesLoaded) {
      const ruleRequestMsg: CliRequestMsg = {
        event: 'rules-get-all',
        source: 'RuleView',
        message: 'UserView needs the list of rules',
        data: {
          istest: isTest,
        },
      };
      request(ruleRequestMsg, handleRulesReceived);
    }

    const currentSubscriptionID = subscriptionID.current;

    const subscription: Subscription = {
      subscriptionID: currentSubscriptionID,
      callback: handleRulesUpdated,
      all: true,
    };
    subscribe(subscription, ['rule-update']);

    /*
      Clean up the websocket subscription when unmounting the component.
    */
    return () => {
      unsubscribe(currentSubscriptionID, ['rule-update']);
    };
  }, [
    request,
    handleDevicesReceived,
    isTest,
    handleRulesReceived,
    devices,
    archivedRules,
    isDevicesLoaded,
    isRulesLoaded,
    subscribe,
    unsubscribe,
    handleRulesUpdated,
  ]);
  // --------------------- Websocket Implementation END------------------

  /**
   * When the user creates a new rule, this function is called to handle the response from the server.
   * @param {SrvAnswerMsg} msg - The message with information about the successful
   * or unsuccessful creation of the rule.
   */
  const handleRuleCreated = (msg: SrvAnswerMsg) => {
    const newArchiveRules: SCentralRule[] = msg.data.rules || [];
    if (newArchiveRules) {
      setArchivedRules(newArchiveRules);
    }

    const requestResult = msg.data.requestResult;
    if (requestResult) {
      let text;
      if (requestResult.success) {
        text = t('_rulecreated_');
      } else {
        text = t('_rulenotcreated_');
      }
      const userInfo: UserInfo = {
        title: '',
        text,
        severity: requestResult.success ? 'success' : 'error',
        visible: true,
      };
      publishEvent('userInfo', userInfo);
    }
  };

  /**
   * When the user updates a rule, this function is called to handle the response from the server.
   * @param {SrvAnswerMsg} msg - The message with information about the successful
   * or unsuccessful update of the rule.
   */
  const handleRuleUpdated = (msg: SrvAnswerMsg) => {
    const requestResult = msg.data.requestResult;

    if (requestResult) {
      const updatedRule = archivedRules.find(
        (archivedRule) => archivedRule.ruleid === requestResult.id
      );
      const rulename = typeof updatedRule !== 'undefined' ? updatedRule.name : '';
      let text;
      if (requestResult.success) {
        text = t('_ruleupdated_', { rulename });
      } else {
        text = t('_rulenotupdated_', { rulename });
      }
      const userInfo: UserInfo = {
        title: '',
        text,
        severity: requestResult.success ? 'success' : 'error',
        visible: true,
      };
      publishEvent('userInfo', userInfo);
    }
  };

  /**
   * Called from the Create Rule dialog when a rule must be saved.
   * The rule is send to the server. The server responds with all rules (this maintains the correct ids)
   * @param {ArchivedRule} createdRule - The rule that was created
   */
  const handleSaveRule = (createdRule: ArchivedRule) => {
    const scentralRule = createdRule as SCentralRule;
    scentralRule.commandsDevices = commandsDevices;
    scentralRule.isEnabled = true;
    scentralRule.createdAt = Date.now();

    const requestMsg: CliRequestMsg = {
      event: 'rule-create',
      source: 'RuleView',
      message: 'RuleView Form wants to create a rule',
      data: {
        rule: scentralRule,
      },
    };
    request(requestMsg, handleRuleCreated);
  };

  /**
   * Called from the simpler interface of RuleEngineJSUI to update a rule.
   * The rule is updated in the array of already existing rules for reuse.
   * @param {ArchivedRule} rule - The rule that was updated by the "assistant like" simpler UI
   */
  const handleUpdateRule = (rule: ArchivedRule) => {
    const newArchivedRules = [...archivedRules];
    const ruleIndex = newArchivedRules.findIndex(
      (archivedRule) => archivedRule.ruleid === rule.ruleid
    );
    const currentRule = newArchivedRules[ruleIndex];
    const scentralRule = rule as SCentralRule;

    // add the properties that not exist on the ArchivedRule type
    scentralRule.commandsDevices = commandsDevices;
    scentralRule.createdAt = currentRule.createdAt;
    scentralRule.triggeredAt = currentRule.triggeredAt;
    scentralRule.isEnabled = currentRule.isEnabled;

    newArchivedRules[ruleIndex] = scentralRule;
    setArchivedRules(newArchivedRules);

    const requestMsg: CliRequestMsg = {
      event: 'rule-update',
      source: 'RuleView',
      message: 'RuleView Form wants to update a rule',
      data: {
        rule: scentralRule,
      },
    };
    request(requestMsg, handleRuleUpdated);
  };

  /**
   * Toggles between the enabled/disabled state of a rule
   * @param {number} ruleid - The id of the rule that must be toggled
   */
  const handleToggleRule = (ruleid: number) => {
    const newArchivedRules = [...archivedRules];
    const ruleIndex = newArchivedRules.findIndex((archivedRule) => archivedRule.ruleid === ruleid);
    const scentralRule = newArchivedRules[ruleIndex];
    scentralRule.isEnabled = !scentralRule.isEnabled;

    newArchivedRules[ruleIndex] = scentralRule;
    setArchivedRules(newArchivedRules);

    const requestMsg: CliRequestMsg = {
      event: 'rule-update',
      source: 'RuleView',
      message: 'RuleView Form wants to update a rule',
      data: {
        rule: scentralRule,
      },
    };
    request(requestMsg, handleRuleUpdated);
  };

  /**
    Called from within the table row popover, when a rule
    must be deleted. Send a delete request to the server.
    The server responds with an updated list of rules.
    @param {number} ruleid The id of the user that must be deleted
  */
  const handleDeleteRule = (ruleid: number) => {
    const requestMsg: CliRequestMsg = {
      event: 'rule-delete',
      source: 'RuleView',
      message: 'RuleView wants to delete a rule',
      data: {
        ids: [ruleid],
      },
    };
    request(requestMsg, handleRulesReceived);
  };

  /**
    Called from within the table toolbar
    Delete all selected rules.
    The server responds with an updated list of rules.
  */
  const handleDeleteSelected = () => {
    const ids = archivedRules.filter((r) => selected.includes(r.name)).map((r) => r.ruleid);
    setSelected([]);
    const requestMsg: CliRequestMsg = {
      event: 'rule-delete',
      source: 'RuleView',
      message: 'RuleView wants to delete rules',
      data: {
        ids,
      },
    };
    request(requestMsg, handleRulesReceived);
  };

  /**
   * When a command changes, it also must be changed in the list
   * of command / device combinations.
   * @param {string} command - The new command that must be changed
   * @param {number} cdIndex - The index in the list where the new command will be placed.
   */
  const handleCommandChange = (command: string, cdIndex: number) => {
    console.log(command, cdIndex);
    const newCommandsDevices = [...commandsDevices];
    newCommandsDevices[cdIndex].command = command;
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Changes a device in the list of command / device selections
   * @param {string} id - The id of the new device that must be put in the list.
   * @param {number} cdIndex - The index in the list, where the given device is placed
   */
  const handleDeviceChange = (id: string, cdIndex: number) => {
    const newCommandsDevices = [...commandsDevices];
    const selectedDevice = devices.find((device) => device.id === id);
    if (typeof selectedDevice !== 'undefined')
      // add only the necessary information about the device to the command / device list
      newCommandsDevices[cdIndex].device = { cname: selectedDevice.cname, id: selectedDevice.id };
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Adds a command / device combination to the corresponding list.
   * Adds only the devices that are not already selected.
   */
  const handleAddCommand = () => {
    const newCommandsDevices = [...commandsDevices];

    const leftDevices = devices.filter(
      (device) =>
        newCommandsDevices.findIndex((commandDevice) => commandDevice.device.id === device.id) ===
        -1
    );

    newCommandsDevices.push({
      command: commands[0],
      device: leftDevices[0],
    });
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Deletes a command / device combination from the list.
   * @param {number} cdIndex - The index of the command / device entry to delete.
   */
  const handleDeleteCommand = (cdIndex: number) => {
    const newCommandsDevices = [...commandsDevices];
    newCommandsDevices.splice(cdIndex, 1);
    setCommandsDevices(newCommandsDevices);
  };

  /**
   * Opens the simple rule dialog either with an already existing rule to update it
   * or, if rule is undefined, to create a new rule.
   * @param {SCentralRule} [rule] - If given, the rule can be updated.
   */
  const handleOpenRule = (rule?: SCentralRule) => {
    if (typeof rule !== 'undefined') {
      setCommandsDevices(rule.commandsDevices);
    }
    setIsOpenRule({ open: true, rule });
  };

  /**
   * Close the create rule dialog.
   */
  const onCloseCreateRule = () => {
    setIsOpenRule({ open: false, rule: undefined });
  };

  /**
    Controls the really delete button in the table toolbar
    @param {boolean} show Show the 'really delete' menue item or not
  */
  const handleShowReallyDelete = (show: boolean) => {
    setShowReallyDelete(show);
  };

  /**
   * Sorts the table by a certain rule property clicked in the table head
   * @param {string} property The rule property to sort the table (e.g. name)
   */
  const handleTableSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    if (property !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
  };

  /**
    Add all rules to the selection. 
    @param {object} e The event of the clicked Checkbox
  */
  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = archivedRules.map((r) => r.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
    setShowReallyDelete(false);
  };

  /**
    When a checkbox of the rule table is clicked, 
    this function creates an array of selected names
    @param {string} name The name of a rule that must be added to the selection
  */
  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setShowReallyDelete(false);
  };

  /**
    The table supports paging of the rules.
    Handle the new page setting.
    @param {object} e The Mouse event
    @param {number} newPage The current page of the table
  */
  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /**
   * Set the number of rule rows that is shown on one page
   * @param {object} e The change event when the number was changed
   */
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  /**
   * Applies a filter to the rules if text is entered in the search bar
   * @param {object} e The event triggered when text is entered
   */
  const handleFilterByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  /**
    Applies sorting and filtering on the rules array depending on the current search / filter input.
    TODO: find a way to choose a different field then name.
    dataFiltered is the resulting Array with the sorted and filterec rules
  */
  const dataFiltered: SCentralRule[] = applyRuleFilter({
    inputData: archivedRules,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  /**
   * Because there are no devices during the first render this
   * is called to preset the first selected command/device combination in the addon
   * @returns {string} The first command / device combination in the list
   */
  const getFirstCommandDevice = (): string => {
    if (commandsDevices.length > 0) {
      return `${commandsDevices[0].command} ${commandsDevices[0].device.cname}`;
    } else {
      return '';
    }
  };

  const addons: Addon[] = [
    {
      summary: t('_rui_chooseaction_'),
      selected: getFirstCommandDevice(),
      details: (
        <CommandDevice
          commands={commands}
          devices={devices}
          commandsDevices={commandsDevices}
          handleCommandChange={handleCommandChange}
          handleDeviceChange={handleDeviceChange}
          handleAddCommand={handleAddCommand}
          handleDeleteCommand={handleDeleteCommand}
        />
      ),
    },
  ];

  // Because the schemas must be enriched with the devices, the list is empty during first render.
  if (schemas.length === 0) return null;

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        sx={{
          mt: 2,
          mb: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">{t('Rules')}</Typography>
        <Button
          data-testid="rule_newrule_button"
          disabled={schemas.length === 0}
          variant="contained"
          color="inherit"
          onClick={() => handleOpenRule()}
        >
          {t('_newrule_')}
        </Button>
      </Stack>

      <Card>
        <RuleTableToolbar
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder={t('_searchrule_')}
          handleDeleteSelected={handleDeleteSelected}
          showReallyDelete={showReallyDelete}
          handleShowReallyDelete={handleShowReallyDelete}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }} size="small">
            <RuleTableHead
              order={order}
              orderBy={orderBy}
              rowCount={rowCount}
              numSelected={selected.length}
              handleTableSort={handleTableSort}
              handleSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rule: SCentralRule) => (
                  <RuleTableRow
                    key={rule.ruleid}
                    rule={rule}
                    schemaName={schemas.find((s) => s.schemaId === rule.schemaId)?.name || ''}
                    selected={selected.indexOf(rule.name) !== -1}
                    handleClick={() => handleClick(rule.name)}
                    handleDeleteRule={handleDeleteRule}
                    handleOpenRule={handleOpenRule}
                    handleToggleRule={handleToggleRule}
                  />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, archivedRules.length)}
              />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={archivedRules.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `more than} ${to}`}`
          }
        />
      </Card>

      <RuleEngineJSUI
        isOpenCreateRule={isOpenRule.open}
        onCloseCreateRule={onCloseCreateRule}
        schemas={schemas}
        isSaveRule
        addons={addons}
        customLabels={customLabels}
        handleSaveRule={handleSaveRule}
        handleUpdateRule={handleUpdateRule}
        archivedRule={isOpenRule.rule}
      />
    </Container>
  );
}
