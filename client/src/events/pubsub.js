/*
  Author: André Kreienbring
  A set of helpers used to publish and subsribe to custom Events.
  These are Browser events as usually used in the DOM

  As in JSDOM while testing document is undefined, the check protects from errors 
  while testing.
*/

/**
 * Subcribe to the event given with eventName
 * @param {string} eventName The name of the event to subscribe to
 * @param {function} listener The callback function that will be added
 */
const subscribeEvent = (eventName, listener) => {
  if (typeof document !== 'undefined') document.addEventListener(eventName, listener);
};

/**
 * Unsubscribes from the event given with eventName
 * @param {*} eventName The name of the event to unsubscribe from
 * @param {*} listener The callback function that will be removed
 */
const unsubscribeEvent = (eventName, listener) => {
  if (typeof document !== 'undefined') document.removeEventListener(eventName, listener);
};

/**
 * A component uses this function to publish an event
 * @param {string} eventName The name of the event that is published
 * @param {object} data Custom data published witch the event
 */
const publishEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  if (typeof document !== 'undefined') document.dispatchEvent(event);
};

export { publishEvent, subscribeEvent, unsubscribeEvent };
