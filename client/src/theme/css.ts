/* eslint-disable jsdoc/require-jsdoc */

import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
interface BgBlurProps {
  color: string;
  blur?: number;
  opacity?: number;
}

export function bgBlur({ color = '#000000', blur = 6, opacity = 0.8 }: BgBlurProps) {
  return {
    backdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
    WebkitBackdropFilter: `blur(${blur}px)`,
  };
}

// ----------------------------------------------------------------------
interface BgGradientProps {
  direction: string;
  startColor: string;
  endColor: string;
  imgUrl: string;
  color: string;
}

export function bgGradient(props: BgGradientProps) {
  const direction = props?.direction || 'to bottom';
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}
