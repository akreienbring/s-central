/*
  Author: André Kreienbring
  This component allows the user to create new scenes with all or selected devices and their current states or select an existing one.
  When a scene is created or deleted, the server sends a message with the result of the action and the list of all existing scenes.
  The component listens to these messages and updates the state accordingly.
  It also listens to device selection events from the ShellyCards to keep track of which devices are selected for creating a scene with selected devices.
*/
import type { Scene } from '@src/types/device';

import { sortBy, isEqual } from 'lodash';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { useState, type JSX, useEffect, useCallback } from 'react';
import { publishEvent, subscribeEvent, unsubscribeEvent } from '@src/events/pubsub';

import TextField from '@mui/material/TextField';
import { Stack, Tooltip, IconButton } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<Scene>();

interface ShellyScenesProps {
  selectedDevices: string[];
  handleSetSelection: (all: boolean, ids?: string[] | number[] | undefined) => void;
}

/**
 * Lets the user select or create a scene with all or selected devices and their current states
 * @param {ShellyScenesProps} props
 * @param {string[]} props.selectedDevices The array with the ids of the currently selected devices
 * @param {Function} props.handleSetSelection The function to select all, none or some devices
 * @returns {JSX.Element} The components with the controls for creating and selecting scenes.
 */
export default function ShellyScenes({
  selectedDevices,
  handleSetSelection,
}: ShellyScenesProps): JSX.Element {
  const { request, user } = useShelly();
  const [value, setValue] = useState<Scene | null>(null);
  const [scenes, setScenes] = useState<readonly Scene[]>([]);
  const [devicesInScene, setDevicesInScene] = useState<(string | number)[]>([]);
  const [isSwitchChanged, setIsSwitchChanged] = useState(false);
  const { t } = useTranslation();

  /**
   * After loading all existing scenes from the server, this function is called to update the state with the received list of scenes.
   * Also called after deleting a scene to update the list of scenes and show a user info message about the successful or unsuccessful deletion.
   * @param {SrvAnswerMsg} msg - The message with the list of all existing scenes.
   */
  const handleScenesReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      if (msg.data.scenes) setScenes(msg.data.scenes);

      if (msg.event === 'scene-delete' && msg.data.requestResult) {
        // a scene was deleted
        let text;
        const requestResult = msg.data.requestResult;
        if (requestResult.success) {
          text = t('_scenedeleted_', { name: value?.name });
          setValue(null);
        } else {
          text = t('_scenenotdeleted_', { name: value?.name });
        }
        const userInfo: UserInfo = {
          title: '',
          text,
          severity: requestResult.success ? 'success' : 'error',
          visible: true,
        };
        publishEvent('userInfo', userInfo);
      }
    },
    [t, value]
  );

  /**
   * When a switch was changed and the corresponding device is part of the currently selected scene,
   * the user may update the scene on the server side.
   */
  const handleSwitchChanged = useCallback(
    (event: CustomEvent) => {
      if (event && event.detail) {
        if (devicesInScene.includes(event.detail)) setIsSwitchChanged(true);
      }
    },
    [devicesInScene]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    Upon mounting the component sends a request for all scenes to the server. 
    The server answers and the response is handled accordingly.
  */
  useEffect(() => {
    if (user!.userid) {
      const requestMsg: CliRequestMsg = {
        event: 'scenes-get-all',
        source: 'Shelly Scenes',
        message: 'Shelly Scenes needs the list of scenes',
        data: { userid: user!.userid },
      };
      request(requestMsg, handleScenesReceived);
    }

    subscribeEvent('switchChanged', handleSwitchChanged as EventListener);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('switchChanged', handleSwitchChanged as EventListener);
    };
  }, [request, handleScenesReceived, handleSwitchChanged, user]);
  // --------------------- Websocket Implementation END------------------

  /**
   * When a scene was set, the contained devices will be selected to prepare a possible update of the scene.
   * The devices contained in the scene are saved in a state to be able to detect if the selection has changed.
   * @param {SrvAnswerMsg} msg - The message with information about the selectd devices
   *
   */
  const handleSceneSelected = (msg: SrvAnswerMsg) => {
    const requestResult = msg.data.requestResult;
    if (requestResult && requestResult.ids) {
      handleSetSelection(false, requestResult.ids);
      setDevicesInScene(requestResult.ids);
      setIsSwitchChanged(false);
    }
  };

  /**
   * When a scene was updated inform the user about the successful or unsuccessful update with a user info message.
   * @param {SrvAnswerMsg} msg - The message with information about the successful or unsuccessful update of the scene.
   */
  const handleSceneUpdated = (msg: SrvAnswerMsg) => {
    const requestResult = msg.data.requestResult;
    if (requestResult) {
      if (requestResult.success) {
        setIsSwitchChanged(false);
        setDevicesInScene(selectedDevices);
      }

      const userInfo: UserInfo = {
        title: '',
        text: requestResult.success
          ? t('_sceneupdated_', { name: value?.name })
          : t('_scenenotupdated_', { name: value?.name }),
        severity: requestResult.success ? 'success' : 'error',
        visible: true,
      };
      publishEvent('userInfo', userInfo);
    }
  };

  /**
   * When the user creates a new scene, this function is called to handle the response from the server.
   * @param {SrvAnswerMsg} msg - The message with information about the successful
   * or unsuccessful creation of the scene.
   */
  const handleSceneCreated = (msg: SrvAnswerMsg) => {
    setIsSwitchChanged(false);
    const newScenes: Scene[] = msg.data.scenes || [];
    if (newScenes) {
      setScenes(newScenes);
    }

    const requestResult = msg.data.requestResult;
    if (requestResult && requestResult.ids && requestResult.ids[0]) {
      let existingScene = null;
      if (requestResult.success) {
        existingScene = newScenes.find((scene) => scene.id === requestResult.ids![0]);
        if (existingScene) setValue(existingScene);
      }

      let text;
      if (requestResult.success && existingScene) {
        text = t('_scenecreated_', {
          name: existingScene.name,
          selected: selectedDevices.length,
        });
      } else {
        text = t('_scenenotcreated_', { name: value?.name });
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
   * This function is called when the user changes the input value in the autocomplete component.
   * It updates the state with the new value, which can be either a string (if the user types a new value)
   * or an object (if the user selects an existing option)
   * @param {Scene | string | null} newValue - The new value selected or entered by the user
   * @returns {void}
   */
  const handleSceneChange = (newValue: Scene | string | null): void => {
    if (typeof newValue === 'string') {
      // the user typed (not clicked) an entry.
      const existingScene = scenes.find((scene) => scene.name === newValue);
      if (existingScene) {
        setValue(existingScene);
      } else {
        setValue({
          name: newValue,
        });
      }
      setIsSwitchChanged(false);
    } else if (newValue && newValue.inputValue) {
      // The user clicked on the "add" option. Create a new value from the user input
      setValue({
        name: newValue.inputValue,
      });
      // and create the new scene. If no ids are send, a scene with all devices will be created.
      const requestMsg: CliRequestMsg = {
        event: 'scene-create',
        source: 'Shelly Scenes',
        message: 'Shelly Scenes - Create Scene',
        data: {
          scene: { name: newValue.inputValue },
          ids: selectedDevices,
          userid: user!.userid,
        },
      };
      request(requestMsg, handleSceneCreated);
    } else {
      // the user selected an existing option from the list.
      // Update the state and set the selected scene on the server so that the states of all devices in the scene will be applied.
      setValue(newValue);

      if (newValue !== null) {
        const sendMsg: CliRequestMsg = {
          event: 'scene-select',
          source: 'Shelly Scenes',
          message: 'Shelly Scenes - Set selected scene',
          data: {
            id: newValue.id,
          },
        };
        request(sendMsg, handleSceneSelected);
      }
    }
  };

  /**
   * Delete the currently selected scene.
   */
  const handleDeleteScene = () => {
    if (!value || !value.id) return;

    setIsSwitchChanged(false);

    const requestMsg: CliRequestMsg = {
      event: 'scene-delete',
      source: 'Shelly Scenes',
      message: 'Shelly Scenes - Delete Scene',
      data: {
        id: value.id,
      },
    };
    request(requestMsg, handleScenesReceived);
  };

  /**
   * Update the currently selected scene.
   */
  const handleUpdateScene = () => {
    if (!value || !value.id) return;

    const requestMsg: CliRequestMsg = {
      event: 'scene-update',
      source: 'Shelly Scenes',
      message: 'Shelly Scenes - Update Scene',
      data: {
        id: value.id,
        ids: selectedDevices,
      },
    };
    request(requestMsg, handleSceneUpdated);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title={t('_selectall_')}>
        <IconButton onClick={() => handleSetSelection(true)}>
          <Iconify icon="tabler:copy-check" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('_selectnone_')}>
        <IconButton onClick={() => handleSetSelection(false)}>
          <Iconify icon="tabler:copy-x" />
        </IconButton>
      </Tooltip>
      {(isSwitchChanged || !isEqual(sortBy(devicesInScene), sortBy(selectedDevices))) &&
        selectedDevices.length > 0 &&
        value &&
        value.id !== undefined && (
          <Tooltip title={t('_updatescene_', { name: value.name })}>
            <IconButton onClick={handleUpdateScene}>
              <Iconify icon="material-symbols:save-outline-rounded" />
            </IconButton>
          </Tooltip>
        )}
      {value && value.id !== undefined && (
        <Tooltip title={t('_deletescene_', { name: value.name })}>
          <IconButton data-testid="scene_delete_button" onClick={handleDeleteScene}>
            <Iconify icon="eva:trash-2-outline" color="red" />
          </IconButton>
        </Tooltip>
      )}

      <Autocomplete
        data-testid="scene_autocomplete_component"
        value={value}
        onChange={(e, newValue) => handleSceneChange(newValue)}
        onInputChange={(e, newValue) => {
          if (value && value!.id) {
            setValue(null);
          } else {
            handleSceneChange(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option.name);
          if (inputValue !== '' && !isExisting && selectedDevices.length > 0) {
            // Suggest the creation of a new value
            filtered.push({
              inputValue,
              name: t('_scenecadd_', { name: inputValue }),
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        clearText={t('Clear')}
        noOptionsText={t('_nooptions_')}
        openText={t('Open')}
        closeText={t('Close')}
        handleHomeEndKeys
        id="select-create-scene"
        options={scenes}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.name;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li data-testid="scene_option" key={key} {...optionProps}>
              {option.name}
            </li>
          );
        }}
        sx={{ width: 200 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label={selectedDevices.length > 0 ? t('_selectcreatescene_') : t('_selectscene_')}
            // see: https://github.com/mui/material-ui/issues/43869 why slotProps are not used here for the TextField component in the Autocomplete component.
            inputProps={{ ...params.inputProps, maxLength: 20 }}
          />
        )}
      />
    </Stack>
  );
}
