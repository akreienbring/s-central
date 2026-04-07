/*
  Author: André Kreienbring
  Presents components to control the switches of a Shelly. Like e.g.:
  Brightness
  White
  RGB
  If a device does not have any of these switches, the component will not be shown.
  For documentation of the multi-color-input see https://viclafouch.github.io/mui-color-input/docs/api-reference/
*/
import type { Device, DeviceSwitch, SwitchCopySource } from '@src/types/device';

import debounce from 'lodash/debounce';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useMemo, type JSX, useState, useEffect, useCallback } from 'react';
import { publishEvent, subscribeEvent, unsubscribeEvent } from '@src/events/pubsub';
import { MuiColorInput, type MuiColorInputValue, type MuiColorInputColors } from 'mui-color-input';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

interface ShellyControlsProps {
  device: Device;
  handleSwitchSet: (aSwitch: DeviceSwitch) => void;
}

/**
  Offers controls to change brightness, white value and rgb of the
  switch of a device.
  @param {ShellyControlsProps} props
  @param {Device} props.device The device with switches
  @param {Function} props.handleSwitchSet Called when values of a switch will 
    be transmitted to the websocket server
  @returns {JSX.Element} The components with the controls for the switch of the device.
*/
const ShellyControls = ({ device, handleSwitchSet }: ShellyControlsProps): JSX.Element => {
  const [copySource, setCopySource] = useState<SwitchCopySource | null>(null);
  const [aSwitch, setASwitch] = useState<DeviceSwitch>(device.switches[0]); //only the first switch is supported for now
  const { t } = useTranslation();

  const [rgb, setRGB] = useState<MuiColorInputValue>(
    typeof aSwitch.rgb !== 'undefined'
      ? `rgb (${aSwitch.rgb[0]}, ${aSwitch.rgb[1]}, ${aSwitch.rgb[2]})`
      : 'undefined'
  );
  const [brightness, setBrightness] = useState(aSwitch?.brightness);
  const [white, setWhite] = useState(aSwitch?.white);

  /**
   * debounce protects the sever of to many updates while moving the sliders
   */
  const debouncedSwitchSet = useMemo(
    () => debounce(handleSwitchSet, 30, { leading: false, trailing: true }),
    [handleSwitchSet]
  );

  /**
   * Handles the event when another component sets or resets the copy source.
   * @param {object} event The event contains the new copy source or null when reset
   */
  const handleCopySourceSet = useCallback((event: CustomEvent) => {
    if (event !== null) setCopySource(event.detail);
  }, []);

  /* 
    Update switches when the device changes. This can happen when
    the settings were changed from another client. 
  */
  useEffect(() => {
    subscribeEvent('copySourceSet', handleCopySourceSet as EventListener);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('copySourceSet', handleCopySourceSet as EventListener);
    };
  }, [handleCopySourceSet]);

  /**
   * If the switch of this device is the copy source, the copy switch values are updated.
   * @param {DeviceSwitch} copySwitch The switch that is currently the copy source
   */
  const updateCopySource = (copySwitch: DeviceSwitch) => {
    if (copySource?.aSwitch.deviceId === device.id) {
      const newCopySource: SwitchCopySource = {
        deviceName: device.cname,
        aSwitch: copySwitch,
      };
      publishEvent('copySourceSet', newCopySource);
    }
  };

  /**
    Called when the color input was changed. If this device is the copy source then
    the color value of the copy source is also updated.
    @param {string} color The new color value stringified (depends on the 'format' of the input)
    @param {MuiColorInputColors} colors an object of the color value in different formats stringified 
      (hex, hex8, hsl, hsv, rgb)
  */
  const handleRGBChange = (color: string, colors: MuiColorInputColors) => {
    setRGB(colors.rgb);
    const aNewSwitch = { ...aSwitch };
    // convert the colors rgb string to an array
    aNewSwitch.rgb = colors.rgb
      .substring(colors.rgb.indexOf('(') + 1, colors.rgb.indexOf(')'))
      .split(',')
      .map((val) => Number(val));
    setASwitch(aNewSwitch);
    updateCopySource(aNewSwitch);
    debouncedSwitchSet(aNewSwitch);
  };

  /**
    Called when the brightness value was changed. If this device is the copy source then
    the color value of the copy source is also updated.
    @param {Event} e The event when changing the brightness value
    @param {number} newValue The new brightness value
  */
  const handleBrightnessChange = (e: Event, newValue: number) => {
    setBrightness(newValue);
    const newASwitch = { ...aSwitch };
    newASwitch.brightness = newValue;
    setASwitch(newASwitch);
    updateCopySource(newASwitch);
    debouncedSwitchSet(newASwitch);
  };

  /**
    Called when the white value was changed. If this device is the copy source then
    the color value of the copy source is also updated.
    @param {Event} e The event when changing the white value
    @param {number} newValue The new white value
  */
  const handleWhiteChange = (e: Event, newValue: number) => {
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
          <Typography variant="subtitle2">{t('Brightness')}</Typography>
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
          <Typography variant="subtitle2">{t('White')}</Typography>
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
      <CardActions sx={{ ml: -2, mr: -2, p: 0, minWidth: '110%', justifyContent: 'center' }}>
        <Tooltip
          title={
            copySource?.aSwitch.deviceId !== device.id ? t('_copysettings_') : t('_copyreset_')
          }
        >
          <IconButton
            data-testid="shelly_setcopysource_button"
            onClick={() => {
              if (copySource?.aSwitch.deviceId !== device.id || copySource === null) {
                const newCopySource: SwitchCopySource = {
                  deviceName: device.cname,
                  aSwitch,
                };
                publishEvent('copySourceSet', newCopySource);
              } else {
                publishEvent('copySourceSet', null);
              }
            }}
            color={copySource?.aSwitch.deviceId !== device.id ? 'inherit' : 'success'}
          >
            <Iconify
              icon={copySource?.aSwitch.deviceId !== device.id ? 'tabler:copy' : 'tabler:copy-off'}
            />
          </IconButton>
        </Tooltip>

        {copySource !== null && copySource.aSwitch.deviceId !== device.id && (
          <Tooltip title={t('_pastesettingsfrom_', { deviceName: copySource?.deviceName })}>
            <IconButton onClick={copyFromSource} color="success">
              <Iconify icon="fa7-regular:paste" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Stack>
  );
};

export default ShellyControls;
