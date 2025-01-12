/*
  Author: André Kreienbring
  Presents a selection of Shelly devices in the LoginView
*/
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Carousel from 'react-material-ui-carousel';

import Box from '@mui/material/Box';

import { createUUID } from 'src/utils/general';

export default function DeviceCarousel() {
  const DEVICES = ['Plus1PM', 'Plus1PMMini', 'PlusI4', 'PlusRGBWPM', 'SHBDUO-1', 'SHPLG-S'];

  const [index, setIndex] = useState(0);

  const handleChange = (cur, prev) => {
    setIndex(cur);
    // console.log(cur, prev);
  };

  return (
    <div>
      <Carousel
        index={index}
        onChange={handleChange}
        interval={4000}
        animation="fade"
        indicators
        stopAutoPlayOnHover
      >
        {DEVICES.map((name, i) => (
          <Box
            component="img"
            src={`/assets/images/devices/${name}.png`}
            sx={{
              width: 200,
              hight: 200,
              objectFit: 'scale-down',
            }}
            key={createUUID()}
          />
        ))}
      </Carousel>
    </div>
  );
}
