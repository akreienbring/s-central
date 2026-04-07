/*
  Author: André Kreienbring
  A small card that displays values on the Dashboard
*/
import { type JSX } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------
interface AppWidgetSummaryProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  sx?: object;
}

/**
 * Displays values in the Dashboar View (AppView)
 * @param {AppWidgetSummaryProps} props
 * @param {string} props.title The Title that is describing the value
 * @param {string} props.subtitle An additional subtitle
 * @param {React.ReactNode} [props.icon] An optional icon to display
 * @param {object} [props.sx] A MUI sx object for styling
 * @returns {JSX.Element}
 */
export default function AppWidgetSummary({
  title,
  subtitle,
  icon,
  sx,
  ...other
}: AppWidgetSummaryProps): JSX.Element {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h5">{title}</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {subtitle}
        </Typography>
      </Stack>
    </Card>
  );
}
