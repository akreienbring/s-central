/*
  Author: André Kreienbring
  Presens a circular progress bar with a counter and a max value
*/
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * The Component shows a circular progress bar with a count and a max value
 * @param {object} props
 * @param {number} props.count The  actual value of  count
 * @param {number} props.max The value of max to display
 */
const CircularProgressLabel = ({ count, max }: { count: number; max: number }) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress
      size={40}
      variant="indeterminate"
      color={count >= max - 1 ? 'error' : 'success'}
    />
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="caption" component="div" sx={{ color: 'text.primary' }}>
        {`${count}/${max}`}
      </Typography>
    </Box>
  </Box>
);

export default CircularProgressLabel;
