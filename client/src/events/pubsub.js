/*
  Author: André Kreienbring
  A set of helpers used to publish and subsribe to custom Events.
*/

const subscribeEvent = (eventName, listener) => {
  document.addEventListener(eventName, listener);
};

const unsubscribeEvent = (eventName, listener) => {
  document.removeEventListener(eventName, listener);
};

const publishEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};

export { publishEvent, subscribeEvent, unsubscribeEvent };
