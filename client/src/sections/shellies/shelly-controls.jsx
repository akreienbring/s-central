/*
  Author: André Kreienbring
  Presents components to control the switches of a Shelly. Like e.g.:
  Brightness
  White
  RGBW
  For documentation of the multi-color-input see https://viclafouch.github.io/mui-color-input/docs/api-reference/
*/
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { MuiColorInput } from 'mui-color-input';
import { useMemo, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

/**
  Offers controls to change brightness, white value and rgb of the
  switch of a device.
  @param {object} device The device with switches
  @param {function} handleSwitchSet Called when values of a switch will 
    be transmitted to the websocket server
*/
const ShellyControls = ({ device, handleSwitchSet }) => {
  const [switches, setSwitches] = useState(device.switches);
  const { t } = useTranslation();

  const brightnessSwitch = switches.find((aSwitch) => typeof aSwitch.brightness !== 'undefined');
  const whiteSwitch = switches.find((aSwitch) => typeof aSwitch.white !== 'undefined');
  const rgbSwitch = switches.find((aSwitch) => typeof aSwitch.rgb !== 'undefined');

  const [rgb, setRGB] = useState(
    typeof rgbSwitch !== 'undefined'
      ? `rgb (${rgbSwitch.rgb[0]}, ${rgbSwitch.rgb[1]}, ${rgbSwitch.rgb[2]})`
      : 'rgb (255, 0, 0)'
  );
  const [brightness, setBrightness] = useState(
    typeof brightnessSwitch !== 'undefined' ? brightnessSwitch.brightness : 0
  );
  const [white, setWhite] = useState(typeof whiteSwitch !== 'undefined' ? whiteSwitch.white : 0);

  // debounce protects the sever of to many updates while moving the sliders
  const debouncedSwitchSet = useMemo(
    () => debounce(handleSwitchSet, 30, { leading: false, trailing: true }),
    [handleSwitchSet]
  );

  /**
    Called when the color input was changed.
    @param {string} color The new color value stringified (depends on the 'format' of the input)
    @param {object} colors an object of the color value in different formats stringified 
      (hex, hex8, hsl, hsv, rgb)
  */
  const handleRGBChange = (color, colors) => {
    setRGB(color);
    // add the ip for easy device identification on the server side
    // rgbSwitch.ip = device.ip;
    rgbSwitch.rgb = colors.rgb;
    debouncedSwitchSet(rgbSwitch);
  };

  const handleBrightnessChange = (e, newValue) => {
    setBrightness(newValue);
    // brightnessSwitch.ip = device.ip;
    brightnessSwitch.brightness = newValue;
    debouncedSwitchSet(brightnessSwitch);
  };

  const handleWhiteChange = (e, newValue) => {
    setWhite(newValue);
    // whiteSwitch.ip = device.ip;
    whiteSwitch.white = newValue;
    debouncedSwitchSet(whiteSwitch);
  };

  useEffect(() => {
    setSwitches(device.switches);
  }, [device, setSwitches]);

  return (
    <Stack alignItems="flex-start">
      {typeof brightnessSwitch !== 'undefined' && (
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
      {typeof whiteSwitch !== 'undefined' && (
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
      {typeof rgbSwitch !== 'undefined' && (
        <MuiColorInput
          data-testid="shelly_multicolor_input"
          format="rgb"
          isAlphaHidden
          value={rgb}
          onChange={handleRGBChange}
          size="small"
          variant="outlined"
          aria-label="Color Selection"
          sx={{ pt: 1 }}
        />
      )}
    </Stack>
  );
};

export default ShellyControls;
