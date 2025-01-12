/*
  Author: André Kreienbring
  Shows the title of 'AppView' and 'ShellyView'. 
*/
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/*
  @param {string} title The title that is shown on top of the page.
*/
const ViewTitle = ({ title }) => (
  <Stack
    direction="row"
    sx={{
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}
  >
    <Typography variant="h4">{title}</Typography>
  </Stack>
);

export default ViewTitle;

ViewTitle.propTypes = {
  title: PropTypes.string,
};
