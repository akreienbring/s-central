/*
  Author: André Kreienbring
  A fading alert component to show temporary messages to the user.
*/
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/**
 * The alert component presents an information box that fades out after a few seconds.
 * @param {object} alert The alert object containing title, text, severity, and visibility
 * @param {string} alert.title The title of the alert
 * @param {string} alert.text The text content of the alert
 * @param {string} alert.severity The severity level of the alert (e.g., 'info', 'warning', 'error', 'success')
 * @param {boolean} alert.visible Indicates whether the alert is visible
 * @param {function} setAlert Function to update the alert state
 * @returns
 */
export default function FadingAlert({ alert, setAlert }) {
  return (
    <Fade
      in={alert.visible} //Write the needed condition here to make it appear
      timeout={{ enter: 0, exit: 2000 }} //Edit these two values to change the duration of transition when the element is getting appeared and disappeard
      addEndListener={() => {
        setTimeout(() => {
          setAlert({
            title: alert.title,
            text: alert.text,
            severity: alert.severity,
            visible: false,
          });
        }, 5000);
      }}
    >
      <Alert severity={alert.severity} variant="filled" sx={{ maxHeight: '50px', width: '100%' }}>
        {alert.title !== '' && <AlertTitle>{alert.title}</AlertTitle>}
        {alert.text}
      </Alert>
    </Fade>
  );
}
