/*
  Author: André Kreienbring
  Renders the scripts of a Shelly devices including their 'running' status.
*/
import type { Params, ParamsScript } from '@src/types/device';

import { type JSX } from 'react';
import { createUUID } from '@src/utils/general';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Highlighter from '../highlighter';

interface ScriptsProps {
  elementId: string;
  scrollableElementId: string;
  params: Params;
}

/**
  The params property of a 'NotifyFullStatus' websocket message may contain
  various script properties. 
  These are checked for the script status and displayed including their memory state
  @param {string}  elementId The Id of the HTML Element that contains the message.
  @param {string} scrollableElementId The Id of a scrollable HTML Element that constains the HTML Element with the elemenId.
  @param {Params} params The params property of a 'NotifyFullStatus' websocket message
  @returns {JSX.Element[]} The script properties of a 'NotifyFullStatus' websocket message with their status and memory state.
*/
const Scripts = ({ elementId, scrollableElementId, params }: ScriptsProps): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  const paramKeys = Object.keys(params);
  paramKeys.forEach((key) => {
    if (key.startsWith('script')) {
      const script: ParamsScript | undefined = params[`script:${Number(key.split(':')[1])}`]; //e.g. 'script:1'
      elements.push(
        <Stack
          justifyContent="flex-start"
          alignItems="center"
          spacing={0.5}
          direction="row"
          key={createUUID()}
        >
          <Highlighter
            key={createUUID()}
            elementId={elementId}
            scrollableElementId={scrollableElementId}
            text={`"script:${Number(key.split(':')[1])}":{"id":${script!.id},"running":${script!.running ? 'true' : 'false'}`}
          >
            <Typography
              variant="subtitle2"
              color={script!.running ? 'green' : 'red'}
              key={createUUID()}
              sx={{ mb: 1 }}
            >
              &#123;{script!.id}&#125;
            </Typography>
          </Highlighter>
          <Typography variant="caption" key={createUUID()}>
            {Math.round(Number(script?.mem_free) / 1024)} kb free
          </Typography>
        </Stack>
      );
    }
  });
  return elements;
};

export default Scripts;
