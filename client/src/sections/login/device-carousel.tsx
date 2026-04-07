/*
  Author: André Kreienbring
  Presents all tested Shelly devices in the LoginView
*/
import './embla.css';

import { type JSX, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { type EmblaOptionsType } from 'embla-carousel';

import Box from '@mui/material/Box';

/**
 * Display the carousel of devices in the login page
 * @returns {JSX.Element}
 */
export default function DeviceCarousel(): JSX.Element {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [Autoplay({ delay: 3000 })]);
  const DEVICES = [
    'Plus1PM',
    'Plus1PMMini',
    'PlusI4',
    'PlusRGBWPM',
    'SHBDUO-1',
    'SHPLG-S',
    'Plus2PM',
    'Mini1PMG3',
    'SHRGBW2',
  ];

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    autoplay.play();
  }, [emblaApi]);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {DEVICES.map((name, index) => (
            <div className="embla__slide" key={index}>
              <Box
                className="embla__slide__number"
                component="img"
                src={`/assets/images/devices/${name}.png`}
                sx={{
                  pl: 12,
                  width: 250,
                  height: 150,
                  maxHeight: 150,
                  maxWidth: 250,
                  objectFit: 'scale-down',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /*
  return (
    <div>
      <Carousel
        index={index}
        onChange={handleChange}
        interval={4000}
        animation="fade"
        indicators
        stopAutoPlayOnHover
        NextIcon=""
        PrevIcon=""
      >
        {DEVICES.map((name) => (
          <Box
            component="img"
            src={`/assets/images/devices/${name}.png`}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              hight: 100,
              objectFit: 'scale-down',
            }}
            key={createUUID()}
          />
        ))}
      </Carousel>
    </div>
  );
  */
}
