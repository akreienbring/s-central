/*
  Author: André Kreienbring
  Presents components to control the switches of a Shelly. Like e.g.:
  Brightness
  White
  RGB
  If a device does not have any of these switches, the component will not be shown.
  For documentation of the multi-color-input see https://viclafouch.github.io/mui-color-input/docs/api-reference/
*/
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { MuiColorInput } from 'mui-color-input';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { publishEvent, subscribeEvent, unsubscribeEvent } from 'src/events/pubsub';

/**
  Offers controls to change brightness, white value and rgb of the
  switch of a device.
  @param {object} device The device with switches
  @param {function} handleSwitchSet Called when values of a switch will 
    be transmitted to the websocket server
*/
const ShellyControls = ({ device, handleSwitchSet }) => {
  const [copySource, setCopySource] = useState(null);
  const [aSwitch, setASwitch] = useState(device.switches[0]); //only the first switch is supported for now
  const { t } = useTranslation();

  const [rgb, setRGB] = useState(
    typeof aSwitch.rgb !== 'undefined'
      ? `rgb (${aSwitch.rgb[0]}, ${aSwitch.rgb[1]}, ${aSwitch.rgb[2]})`
      : 'undefined'
  );
  const [brightness, setBrightness] = useState(aSwitch?.brightness);
  const [white, setWhite] = useState(aSwitch?.white);

  // debounce protects the sever of to many updates while moving the sliders
  const debouncedSwitchSet = useMemo(
    () => debounce(handleSwitchSet, 30, { leading: false, trailing: true }),
    [handleSwitchSet]
  );

  /**
   * Handles the event when another component sets or resets the copy source.
   * @param {object} event The event contains the new copy source or null when reset
   */
  const handleCopySourceSet = useCallback((event) => {
    if (event !== null) setCopySource(event.detail);
  }, []);

  /* 
    Update switches when the device changes. This can happen when
    the settings were changed from another client. 
  */
  useEffect(() => {
    subscribeEvent('copySourceSet', handleCopySourceSet);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('copySourceSet');
    };
  }, [handleCopySourceSet]);

  /**
   * If the switch of this device is the copy source, the copy source values are updated.
   */
  const updateCopySource = (newASwitch) => {
    if (copySource?.deviceId === device.id) {
      publishEvent('copySourceSet', {
        deviceId: device.id,
        deviceName: device.cname,
        aSwitch: newASwitch,
      });
    }
  };
  /**
    Called when the color input was changed. If this device is the copy source then
    the color value of the copy source is also updated.
    @param {string} color The new color value stringified (depends on the 'format' of the input)
    @param {object} colors an object of the color value in different formats stringified 
      (hex, hex8, hsl, hsv, rgb)
  */
  const handleRGBChange = (color, colors) => {
    setRGB(colors.rgb);
    const newASwitch = { ...aSwitch };
    newASwitch.rgb = colors.rgb;
    setASwitch(newASwitch);
    updateCopySource(newASwitch);
    debouncedSwitchSet(newASwitch);
  };

  const handleBrightnessChange = (e, newValue) => {
    setBrightness(newValue);
    const newASwitch = { ...aSwitch };
    newASwitch.brightness = newValue;
    setASwitch(newASwitch);
    updateCopySource(newASwitch);
    debouncedSwitchSet(newASwitch);
  };

  const handleWhiteChange = (e, newValue) => {
    setWhite(newValue);
    const newASwitch = { ...aSwitch };
    newASwitch.white = newValue;
    setASwitch(newASwitch);
    updateCopySource(newASwitch);
    debouncedSwitchSet(newASwitch);
  };

  /**
   * The values from the copy source are set and the controls are rerendered.
   * After that the handleSwitchSet is called to transmit the values to the server.
   */
  const copyFromSource = () => {
    if (typeof copySource === 'undefined' || copySource === null) return;

    const newASwitch = { ...aSwitch };
    const sourceSwitch = copySource.aSwitch;
    //copy only the settings that exist on both switches
    if (
      typeof aSwitch.brightness !== 'undefined' &&
      typeof sourceSwitch.brightness !== 'undefined'
    ) {
      newASwitch.brightness = sourceSwitch.brightness;
      setBrightness(sourceSwitch.brightness);
    }
    if (typeof aSwitch.white !== 'undefined' && typeof sourceSwitch.white !== 'undefined') {
      newASwitch.white = sourceSwitch.white;
      setWhite(sourceSwitch.white);
    }
    if (typeof aSwitch.rgb !== 'undefined' && typeof sourceSwitch.rgb !== 'undefined') {
      newASwitch.rgb = sourceSwitch.rgb;
      setRGB(`rgb (${sourceSwitch.rgb[0]}, ${sourceSwitch.rgb[1]}, ${sourceSwitch.rgb[2]})`);
    }
    setASwitch(newASwitch);

    handleSwitchSet(newASwitch);
  };

  return (
    <Stack alignItems="flex-start">
      {typeof aSwitch.brightness !== 'undefined' && (
        <>
          <Typography variant="subtitle">{t('Brightness')}</Typography>
          <Slider
            data-testid="shelly_brightness_slider"
            value={brightness}
            min={0}
            max={100}
            step={10}
            marks
            valueLabelDisplay="auto"
            size="small"
            onChange={handleBrightnessChange}
            aria-label="Brighness slider"
          />
        </>
      )}
      {typeof aSwitch.white !== 'undefined' && (
        <>
          <Typography variant="subtitle">{t('White')}</Typography>
          <Slider
            data-testid="shelly_white_slider"
            value={white}
            min={0}
            max={device.gen === 1 ? 100 : 255}
            step={device.gen === 1 ? 10 : 25}
            marks
            valueLabelDisplay="auto"
            size="small"
            onChange={handleWhiteChange}
            aria-label="White slider"
          />
        </>
      )}
      {typeof aSwitch.rgb !== 'undefined' && (
        <MuiColorInput
          data-testid="shelly_multicolor_input"
          format="rgb"
          isAlphaHidden
          value={rgb}
          onChange={handleRGBChange}
          size="small"
          variant="outlined"
          aria-label="Color Selection"
          sx={{ pt: 1, ml: -1 }}
        />
      )}
      <Stack direction="row" justifyContent="center" sx={{ ml: -2, mr: -2, minWidth: '110%' }}>
        <Tooltip
          title={copySource?.deviceId !== device.id ? t('_copysettings_') : t('_copyreset_')}
        >
          <IconButton
            data-testid="shelly_setcopysource_button"
            onClick={() => {
              if (copySource?.deviceId !== device.id || copySource === null) {
                publishEvent('copySourceSet', {
                  deviceId: device.id,
                  deviceName: device.cname,
                  aSwitch,
                });
              } else {
                publishEvent('copySourceSet', null);
              }
            }}
            color={copySource?.deviceId !== device.id ? 'inherit' : 'success'}
          >
            <Iconify
              icon={copySource?.deviceId !== device.id ? 'tabler:copy-check' : 'tabler:copy-off'}
            />
          </IconButton>
        </Tooltip>

        {copySource !== null && copySource.deviceId !== device.id && (
          <Tooltip title={t('_pastesettingsfrom_', { deviceName: copySource?.deviceName })}>
            <IconButton onClick={copyFromSource} color="success">
              <Iconify icon="fa7-regular:paste" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default ShellyControls;
