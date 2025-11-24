/*
    Author: André Kreienbring
    Provides a general context for the whole Application.
    The context is used for user authentication and websocket access

    The basic concept of websocket management is described here:
    https://blog.stackademic.com/websockets-and-react-wscontext-and-components-subscription-pattern-4e580fc67bb5
*/

import websocket from 'websocket';
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';

import { createUUID } from 'src/utils/general';
import { getWSCredentials } from 'src/utils/client-auth';

import { publishEvent } from 'src/events/pubsub';

import { testDevices } from '../cypress/support/testdevices.js';

const Context = createContext();

export const useShelly = () => useContext(Context);

/** 
  A Context Provider that is available in every page of the app by 
  using the exported 'useShelly' hook.
  Once logged in, the user object is stored in (and retrieved from) the
  browsers local storage to prevent logging in after every refresh of the page.
*/
export const SCProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [devices, setDevices] = useState([]);
  const [validationRequest, setValidationRequest] = useState(null);
  const [isTest, setIsTest] = useState(false);
  const [retryCount, setRetryCount] = useState(0.001);
  const ws = useRef(null);
  const subscribtions = useRef({});
  const requests = useRef({});
  const isReconnecting = useRef(false);
  const secret = useRef(null);
  const reconnectMsg = useRef({
    event: 'user reconnect',
    data: {
      name: 'Shelly Context',
      channelID: `sc${createUUID()}`,
      message: 'Hello from Shelly Context',
      user,
    },
  });

  /*
    These events are not forced to send the secret.
    Will be respected by the request function
  */
  const WITHOUT_SECRET = useRef(['user validate', 'blogposts get public', 'user resetpw']);

  /**
    Implements a reconnection strategy.
    Tries to reconnect directly after the ws connection was closed.
    If not successful, subsequent tries will be delayed by
    the configured delay time with a factor.
    After the configured max tries the recursion stops.
    @param {number} currentRetryCount Used to count the number of retries
    @param {boolean} isInit If true the retry count is reset
  */
  const startRetryTimeout = useCallback((currentRetryCount, isInit) => {
    if (reconnectMsg.current.data.user === null) return;
    if (isInit) currentRetryCount = 0.001;
    isReconnecting.current = true;
    setTimeout(
      () => {
        if (ws.current !== null && ws.current.readyState === WebSocket.OPEN) {
          isReconnecting.current = false;
          return;
        }
        if (currentRetryCount > window.scconfig.RECONNECT_MAX) {
          isReconnecting.current = false;
          console.log('Reconnecting makes no sense! Please reload Page');
          publishEvent('lastUpdatedAt', null);
          return;
        }
        console.log(`Trying to reconnect: ${currentRetryCount}`);
        // setRetryCount(currentRetryCount => currentRetryCount + 1);
        setRetryCount(currentRetryCount + 1); // this triggers the useEffect Hook
        startRetryTimeout(currentRetryCount + 1, false);
      },
      currentRetryCount * window.scconfig.RECONNECT_DELAY * 1000
    );
  }, []);

  /**
    A component can subscribe to one or more events.
    @param {object} subscription
    @param {string} subscription.subscriptionID An unique ID that identifies the subscription
    @param {callback} subscription.callback A function that is called when a msg with an event arrives
    @param {boolean} subscription.all  A boolean value that indicates if the component needs all or only specific (device) events
    @param {array} events An array of websocket events (e.g. 'ShellyUpdate')
  */
  const subscribe = (subscription, events) => {
    events.forEach((event) => {
      if (typeof subscribtions.current[event] === 'undefined') {
        subscribtions.current[event] = [subscription];
      } else {
        subscribtions.current[event].push(subscription);
      }
      /*
      console.log(
        `After subscription of ${subscription.subscriptionID} to events ${events}: ${JSON.stringify(subscribtions.current)}`
      );
      */
    });
  };

  /**
   * Unsubscribe from a former subscription
   * @param {string} subscriptionID The ID of the registered subscription
   * @param {Array} events A list of events to unsubscribe from (e.g. 'ShellyUpdate')
   */
  const unsubscribe = (subscriptionID, events) => {
    events.forEach((event) => {
      if (typeof subscribtions.current[event] !== 'undefined') {
        subscribtions.current[event] = subscribtions.current[event].filter(
          (subscription) => subscription.subscriptionID !== subscriptionID
        );
        /*
        console.log(
          `After unsubsribe of ${subscriptionID} from events ${events}: ${JSON.stringify(subscribtions.current)}`
        );
        */
      }
    });
  };

  /**
    Components can send messages directly to the websocket server
    without expecting an answer.
    This messages will ONLY be stored in the requests object,
    if the websocket is closed. Each message triggers a reconnection attempt.
    @param {Object} msg The message that will be send to the websocket server
 */
  const send = useCallback(
    (msg) => {
      const isSecretNeeded = !WITHOUT_SECRET.current.includes(msg.event);
      if (isSecretNeeded) {
        msg.data.secret = secret.current;
      }

      if (
        ws.current !== null &&
        ws.current.readyState === WebSocket.OPEN &&
        (!isSecretNeeded || secret.current !== null)
      ) {
        ws.current.send(JSON.stringify(msg));
      } else {
        // store the message. It will be send, when the websocket reconnects.
        const requestID = createUUID();
        requests.current[requestID] = { msg, undefined };

        if (!isReconnecting.current) startRetryTimeout(retryCount, true);
      }
    },
    [startRetryTimeout, retryCount]
  );

  /**
    A component can request data from the server.
    The requestID is unique an used to identify the request when the data arrives.
    Requests will ALWAYS be stored in the request object.
    Each request that can not be send triggers a reconnection attempt.
    @param {Object} msg The message with the request that is send to the websocket server
    @param {callback} callback The function to call when the data arrives.
  */
  const request = useCallback(
    (msg, callback) => {
      if (msg.event === 'user validate') {
        // if the socket is closed, this will trigger a reconnection
        setIsTest(msg.data.isTest);
        setValidationRequest({ msg, callback });
      } else {
        const requestID = createUUID();
        msg.data.requestID = requestID;
        requests.current[requestID] = { msg, callback };
      }

      const isSecretNeeded = !WITHOUT_SECRET.current.includes(msg.event);
      if (isSecretNeeded) {
        msg.data.secret = secret.current;
      }

      if (
        ws.current !== null &&
        ws.current.readyState === WebSocket.OPEN &&
        (!isSecretNeeded || secret.current !== null)
      ) {
        // console.log(`Socket is open. Sending request '${msg.event}' to the server`);
        ws.current.send(JSON.stringify(msg));
      } else if (
        !isReconnecting.current &&
        (ws.current === null || ws.current.readyState !== WebSocket.OPEN)
      )
        startRetryTimeout(retryCount, true);
    },
    [startRetryTimeout, retryCount]
  );

  /**
    Put the current user in the context of the application.
    This also adds him to the reconnect message to be send when reconnecting the websocket.
    @param {object} theUser The user that was provided by the login form.
  */
  const login = useCallback((theUser) => {
    setUser(theUser);
    reconnectMsg.current.data.user = theUser;
    console.log(`Connecting the logged in user '${theUser.alias}'`);
    // this will send a message with a channelID. Used to manage the connection on the serverside!
    ws.current.send(JSON.stringify(reconnectMsg.current));
  }, []);

  const logout = useCallback(() => {
    // ws.current.close(4001, 'User logged out');
    setUser(null);
    //setDevices([]);
  }, []);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      reconnectMsg.current.data.user = null;
      setDevices([]);
    }
  }, [user]);

  // --------------------- Websocket Implementation END----------------
  /*
    When this effect is executed, a new WebSocket is created that will directly
    connect to the server. Rerunning the effect reconnects when the socket was closed.
  */
  useEffect(() => {
    if (ws.current === null || (isReconnecting && ws.current.readyState !== WebSocket.OPEN)) {
      publishEvent('lastUpdatedAt', 'connecting');
      const wsurl = import.meta.env.DEV ? window.scconfig.WSURL : window.scconfig.WSSURL;
      console.log(`Creating websocket connection to ${wsurl}`);
      ws.current = new websocket.w3cwebsocket(wsurl);
    }

    ws.current.onerror = (e) => console.error(e);

    ws.current.onopen = () => {
      isReconnecting.current = false;
      publishEvent('lastUpdatedAt', Date.now());
      console.log(`WebSocket connection opened for Shelly Context!`);

      if (validationRequest !== null) {
        console.log('Sending an existing validation request');
        /*
          Don't send the password! Instead digest authentication will be used.
          So this will provoke an 401 error.
        */
        ws.current.send(
          JSON.stringify({
            event: 'user validate',
            data: {
              source: validationRequest.msg.data.source,
              message: validationRequest.msg.data.message,
              user: { email: validationRequest.msg.data.user.email },
            },
          })
        );
      } else if (reconnectMsg.current.data.user !== null) {
        console.log(
          `Reconnecting the previously logged in user '${reconnectMsg.current.data.user.alias}'`
        );
        // this will send a message with a channelID. Used to manage the connection on the serverside!
        ws.current.send(JSON.stringify(reconnectMsg.current));
      }

      // send all requests that don't need a secret
      Object.entries(requests.current).forEach((entry) => {
        const [requestID, request] = entry;
        if (WITHOUT_SECRET.current.includes(request.msg.event)) {
          console.log(`Sending '${request.msg.event}' after opening the websocket`);
          try {
            ws.current.send(JSON.stringify(request.msg));
          } catch (e) {
            console.error(e);
          }
        }
        // delete the requests that don't receive an answer and hence have no callback
        if (typeof request.callback === 'undefined') delete requests[requestID];
      });
    };

    ws.current.onmessage = (event) => {
      publishEvent('lastUpdatedAt', Date.now());
      const msg = JSON.parse(event.data);

      if (msg !== null) {
        if (msg.event === 'user validate') {
          if (
            validationRequest !== null &&
            typeof msg.data.error !== 'undefined' &&
            msg.data.error.code === 401
          ) {
            // Not authenticated. Add the credentials to the message
            validationRequest.msg.data.auth = getWSCredentials(
              msg.data.error,
              msg.data.error.message,
              validationRequest.msg.data.user.password,
              validationRequest.msg.data.user.email
            );
            delete validationRequest.msg.data.user.password;
            delete validationRequest.msg.data.error;
            // Retry with challenge response object
            ws.current.send(JSON.stringify(validationRequest.msg));
          } else {
            // authenticated: forward the message to userform to perform a login
            secret.current = msg.data.secret;
            delete msg.data.secret;

            validationRequest.callback(msg);
            setValidationRequest(null);
            console.log(
              `Deleted the 'user validate' request. Now have ${Object.entries(requests.current).length} requests left`
            );
          }
        } else if (msg.event === 'user reconnect') {
          // the secret must be send with every request
          if (typeof msg.data.secret !== 'undefined') {
            const connectedUser = reconnectMsg.current.data.user;
            console.log(
              `Just reconnected with user ${connectedUser.alias}. There are ${Object.entries(requests.current).length} outstanding requests`
            );
            secret.current = msg.data.secret;
            if (!isTest) {
              // if isTest is false: request the devices from the server
              console.log(`Requesting devices of user ${connectedUser.alias}.`);
              ws.current.send(
                JSON.stringify({
                  event: 'devices get all',
                  data: {
                    source: 'Shelly Context',
                    message: 'Shelly Context needs the list of devices',
                    userid: connectedUser.roleid != 1 ? connectedUser.userid : null, //an admin gets all devices
                    secret: secret.current,
                  },
                })
              );
            } else {
              setDevices(testDevices);
              console.log(`Test mode active. Using ${testDevices.length} test devices`);
            }
            /*
            Send all messages that arrived while the socket was not open
            */
            Object.entries(requests.current).forEach((entry) => {
              const [requestID, request] = entry;
              if (!WITHOUT_SECRET.current.includes(msg.event))
                request.msg.data.secret = secret.current;
              console.log(`Sending '${request.msg.event}' after reconnecting`);
              ws.current.send(JSON.stringify(request.msg));
              // delete the requests that don't receive an answer and hence have no callback
              if (typeof request.callback === 'undefined') delete requests[requestID];
            });
          } else {
            // reconnect unsuccessfull: logout
            console.error('Reconnecting was not possible. Logging out!');
            logout();
          }
        } else if (msg.event === 'devices get all' && typeof msg.data.requestID === 'undefined') {
          // this is the initial request for devices sent by the context itself
          console.log(`Context received ${msg.data.devices.length} devices for user ${user.alias}`);
          setDevices(msg.data.devices);
        } else if (msg.event === 'ping') {
          /*
            the server sent a ping! Answer with pong to
            make clear that this socket is still alive.
          */
          ws.current.send(
            JSON.stringify({
              event: 'pong',
              data: {
                source: 'SC Context',
                message: msg.data.message,
              },
            })
          );
        } else if (
          typeof msg.data.requestID !== 'undefined' &&
          typeof requests.current[msg.data.requestID] !== 'undefined'
        ) {
          if (isTest && msg.event === 'device get') {
            // in test mode: sent the test device instead of the received one
            msg.data.device = testDevices[0];
          }

          /*
            Find the request with the provided id and forward the message
            to the stored callback function
          */
          const requestID = msg.data.requestID;
          delete msg.data.requestID; // remove the requestID from the message
          requests.current[requestID].callback(msg);
          delete requests.current[requestID];
          console.log(
            `Deleted request '${msg.event}' on answer: '${msg.data.message}'. Now have ${Object.entries(requests.current).length} requests`
          );
        } else if (typeof msg.event !== 'undefined') {
          /*
            Forward the message to the registered / subscribed callback
            functions for the given msg.event
          */
          if (typeof subscribtions.current[msg.event] !== 'undefined') {
            subscribtions.current[msg.event].forEach((subscription) => {
              if (subscription.all || msg.data.subscriptionID === subscription.subscriptionID) {
                subscription.callback(msg);
              }
            });
          }
        } else {
          console.error(`Shelly context received an unhandled message ${JSON.stringify(msg)} `);
        }
      }
    };

    ws.current.onclose = (e) => {
      if (!isReconnecting.current) {
        publishEvent('lastUpdatedAt', 'connecting');
        startRetryTimeout(retryCount, true);
      } else {
        publishEvent('lastUpdatedAt', null);
      }

      if (ws.current) {
        console.log(
          `WebSocket connection closed by the server for SC Context. Reason: ${e.reason}!`
        );
      } else {
        console.log(
          `WebSocket connection closed because SC Context was unmounted. Reason: ${e.reason}!`
        );
      }
    };
  }, [validationRequest, startRetryTimeout, retryCount, logout]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({ user, devices, login, logout, subscribe, unsubscribe, request, send }),
        [user, devices, login, logout, request, send]
      )}
    >
      {children}
    </Context.Provider>
  );
};
