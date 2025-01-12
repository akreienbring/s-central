/*
    Author: André Kreienbring
    Provides a general context for the whole Application.
    The context is used for user authentication and websocke access

    The basic concept of websocket management is described here:
    https://blog.stackademic.com/websockets-and-react-wscontext-and-components-subscription-pattern-4e580fc67bb5
*/

import websocket from 'websocket';
import PropTypes from 'prop-types';
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

import { globals } from 'src/globals';
import { publishEvent } from 'src/events/pubsub';

const Context = createContext();

export const useShelly = () => useContext(Context);

/*
  A Context Provider that is available in every page of the app by 
  using the exported 'useShelly' hook.
  Once logged in, the user object is stored in (and retrieved from) the
  browsers local storage to prevent logging in after every refresh of the page.
*/
export const SCProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [validationRequest, setValidationRequest] = useState(null);
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
      channel: `sc${createUUID()}`,
      message: 'Hello from Shelly Context',
      user,
    },
  });

  /*
    These events are not forced to send the secret.
    Will be respected by the request function
  */
  const WITHOUT_SECRET = useRef(['user validate', 'blogposts get public']);

  /*
    Implements a reconnection strategy.
    Tries to reconnect directly after the ws connection was closed.
    If not successful, subsequent tries will be delayed by
    the configured delay time with a factor.
    After the configured max tries the recursion stops.
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startRetryTimeout = (currentRetryCount, isInit) => {
    // if (reconnectMsg.current.data.user === null) return;
    if (isInit) currentRetryCount = 0.001;
    isReconnecting.current = true;
    setTimeout(
      () => {
        if (ws.current !== null && ws.current.readyState === WebSocket.OPEN) {
          isReconnecting.current = false;
          return;
        }
        if (currentRetryCount > globals.RECONNECT_MAX) {
          isReconnecting.current = false;
          console.log('Reconnecting makes no sense! Please reload Page');
          publishEvent('lastUpdatedAt', null);
          return;
        }
        console.log(`Trying to reconnect: ${currentRetryCount}`);
        setRetryCount(currentRetryCount + 1); // this triggers the useEffect Hook
        startRetryTimeout(currentRetryCount + 1, false);
      },
      currentRetryCount * globals.RECONNECT_DELAY * 1000
    );
  };

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    reconnectMsg.current.data.user = user;
  }, [user]);

  // --------------------- Websocket Implementation END----------------
  /*
    When this effect is executed, a new WebSocket is created that will directly
    connect to the server. Rerunning the effect reconnects when the socket was closed.
  */
  useEffect(() => {
    // if (validationRequest === null && reconnectMsg.current.data.user === null) return;
    if (ws.current === null || (isReconnecting && ws.current.readyState !== WebSocket.OPEN)) {
      publishEvent('lastUpdatedAt', 'connecting');
      console.log('Creating a new WebSocket Client!');
      // eslint-disable-next-line new-cap
      ws.current = new websocket.w3cwebsocket(import.meta.env.DEV ? globals.WSURL : globals.WSSURL);
    }

    ws.current.onerror = (e) => console.error(e);

    ws.current.onopen = (event) => {
      isReconnecting.current = false;
      publishEvent('lastUpdatedAt', Date.now());
      console.log(`WebSocket connection opened for Shelly Context!`);

      if (validationRequest !== null) {
        // don't send the password! Instead digest authentication will be used
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
        console.log(`Reconnecting the logged in user '${reconnectMsg.current.data.user.alias}'`);
        ws.current.send(JSON.stringify(reconnectMsg.current));
      }

      // send all requests that don't need a secret
      Object.entries(requests.current).forEach((entry) => {
        const [requestID, request] = entry;
        if (WITHOUT_SECRET.current.includes(request.msg.event))
          ws.current.send(JSON.stringify(request.msg));
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
              msg.data.error.message,
              validationRequest.msg.data.user.password,
              validationRequest.msg.data.user.email
            );
            delete validationRequest.msg.data.user.password;
            delete validationRequest.msg.data.error;
            // Retry with challenge response object
            ws.current.send(JSON.stringify(validationRequest.msg));
          } else {
            // authenticated: forward the message
            secret.current = msg.data.secret;
            delete msg.data.secret;
            validationRequest.callback(msg);
            setValidationRequest(null);
            console.log(
              `Deleted the 'user validate request. Now have ${Object.entries(requests.current).length} messages left`
            );
          }
        } else if (msg.event === 'user reconnect') {
          // the secret must be send with every request
          if (typeof msg.data.secret !== 'undefined') {
            secret.current = msg.data.secret;
            /*
            Send all messages that arrived while the socket was not open
            */
            console.log(
              `Just reconnected. There are ${Object.entries(requests.current).length} outstanding messages`
            );
            Object.entries(requests.current).forEach((entry) => {
              const [requestID, request] = entry;
              if (!WITHOUT_SECRET.current.includes(msg.event))
                request.msg.data.secret = secret.current;
              ws.current.send(JSON.stringify(request.msg));
              // delete the requests that don't receive an answer and hence have no callback
              if (typeof request.callback === 'undefined') delete requests[requestID];
            });
          } else {
            // reconnect unsuccessfull: logout
            console.error('Reconnecting was not possible. Logging out!');
            logout();
          }
        } else if (msg.event === 'ping') {
          /*
            the server sent a ping! Answer with the correct pong to
            make clear that this socket is still alive.
          */
          ws.current.send(
            JSON.stringify({
              event: 'pong',
              data: {
                name: 'SC Context',
                message: msg.data.message,
              },
            })
          );
        } else if (
          typeof msg.data.requestID !== 'undefined' &&
          typeof requests.current[msg.data.requestID] !== 'undefined'
        ) {
          /*
            Find the request with the provided id and forward the message
            to the stored callback function
          */
          requests.current[msg.data.requestID].callback(msg);
          delete requests.current[msg.data.requestID];
          console.log(
            `Deleted request ${msg.data.requestID} on answer: '${msg.data.message}'. Now have ${Object.entries(requests.current).length} requests`
          );
        } else if (typeof msg.event !== 'undefined') {
          /*
            Forward the message to the registered / subscribed callback
            functions for the given msg.event
          */
          if (typeof subscribtions.current[msg.event] !== 'undefined') {
            subscribtions.current[msg.event].forEach((subscription) => {
              if (
                subscription.all ||
                msg.data.subscriptionID === subscription.subscriptionID ||
                subscription.all
              ) {
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
  }, [validationRequest, startRetryTimeout, retryCount]);

  /*
    Put the current user in the context of the application.
    This also adds him to the reconnect message to be send when reconnecting the websocket.
    @param {object} The user that was provided by the login form.
  */
  const login = (theUser) => {
    setUser(theUser);
  };

  const logout = () => {
    ws.current.close(4001, 'User logged out');
    setUser(null);
  };

  /*
    A component subscribes to one or more events.
    @param: {object} subscription Is of the form:
      {
        callback: A function that is called when a msg with an event arrives, 
        events: An array with events the component needs to receive,
        all: A boolean value that indicates if the component needs all or only specific (device) events
      }
    @ {string} subscriptionID An identifier that is used when a message arrives
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

  /*
    Components can send messages directly to the websocket server.
    This messages will ONLY be stored in the requests object,
    if the websocket is closed. Each message triggers a reconnection attempt.
    @param {object} msg The message that will be send to the websocket server
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

  /*
    A component can request data from the server.
    The requestID is unique an used to identify the request when the data arrives.
    Requests will ALWAYS be stored in the request object.
    Each request triggers a reconnection attempt.
    @param {object} msg The message with the request that is send to the websocket server
    @param {function} callback The function to call when the data arrives.
  */
  const request = useCallback(
    (msg, callback) => {
      /*
      Discard existing messages. This can happen, if the websocket is closed
      and the user triggers requests more then once.
    */
      let isExistingMessage = false;
      Object.values(requests.current).forEach((aRequest) => {
        if (aRequest.msg.event === msg.event) {
          isExistingMessage = true;
        }
      });

      if (isExistingMessage) return;
      if (msg.event === 'user validate') {
        // if the socket is closed, this will trigger a reconnection
        reconnectMsg.current.data.user = msg.data.user;
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
        ws.current.send(JSON.stringify(msg));
      } else if (!isReconnecting.current) startRetryTimeout(retryCount, true);
    },
    [startRetryTimeout, retryCount]
  );

  return (
    <Context.Provider
      value={useMemo(
        () => ({ user, login, logout, subscribe, unsubscribe, request, send }),
        [user, request, send]
      )}
    >
      {children}
    </Context.Provider>
  );
};

SCProvider.propTypes = {
  children: PropTypes.object,
};
