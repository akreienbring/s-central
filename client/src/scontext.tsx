/*
    Author: André Kreienbring
    Provides a general context for the whole Application.
    The context is used for user authentication and websocket access

    The basic concept of websocket management is described here:
    https://blog.stackademic.com/websockets-and-react-wscontext-and-components-subscription-pattern-4e580fc67bb5
*/

import type { User } from './types/user';
import type {
  Request,
  Subscription,
  RequestBuffer,
  ValidationRequest,
  SubscriptionBuffer,
} from '@src/types/context';

import { useNavigate } from 'react-router';
import { createUUID } from '@src/utils/general';
import { publishEvent } from '@src/events/pubsub';
import { ShellyContext } from '@src/hooks/use-shelly';
import { getWSCredentials } from '@src/utils/client-auth';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

/** 
  A Context Provider that is available in every page of the app by 
  using the 'useShelly' hook.
  Once logged in, the user object is stored in (and retrieved from) the
  browsers local storage to prevent logging in after every refresh of the page.
*/
export const SCProvider = ({ children }: { children: React.ReactNode }) => {
  const storageUser = localStorage.getItem('user');
  const [user, setUser] = useState<User | null>(
    storageUser !== null ? JSON.parse(storageUser) : null
  );
  const [validationRequest, setValidationRequest] = useState<ValidationRequest>();
  const [isTest, setIsTest] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0.001);
  const ws = useRef<WebSocket>(null);
  const subscribtions = useRef<SubscriptionBuffer>({});
  const requests = useRef<RequestBuffer>({});
  const sends = useRef<CliRequestMsg[]>([]);
  const isReconnecting = useRef<boolean>(false);
  const secret = useRef<string>(undefined);
  const navigate = useNavigate();

  const reconnectMsg = useRef({
    event: 'user-reconnect',
    source: 'Shelly Context',
    message: 'Hello from Shelly Context',
    channelID: `sc${createUUID()}`,
    data: {
      user,
    },
  } satisfies CliReconnectMsg);

  /*
    These events are not forced to send the secret.
    Will be respected by the request function
  */
  const WITHOUT_SECRET = useRef(['user-validate', 'blogposts-get-public', 'user-resetpw']);

  /**
    Implements a reconnection strategy.
    Tries to reconnect directly after the ws connection was closed.
    If not successful, subsequent tries will be delayed by
    the configured delay time with a factor.
    After the configured max tries the recursion stops.
    @param {number} currentRetryCount Used to count the number of retries
    @param {boolean} isInit If true the retry count is reset
  */
  const startRetryTimeout = useCallback((currentRetryCount: number, isInit: boolean): void => {
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

        // TODO check with futer version. Rule can't live with recursive calls?
        // eslint-disable-next-line react-hooks/immutability
        startRetryTimeout(currentRetryCount + 1, false);
      },
      currentRetryCount * window.scconfig.RECONNECT_DELAY * 1000
    );
  }, []);

  /**
    A component can subscribe to one or more events.
    @param {Subscription} subscription
    @param {string} subscription.subscriptionID An unique ID that identifies the subscription
    @param {callback} subscription.callback A function that is called when a msg with an event arrives
    @param {boolean} subscription.all  A boolean value that indicates if the component needs all or only specific (device) events
    @param {array} events An array of websocket events (e.g. 'device-update')
  */
  const subscribe = (subscription: Subscription, events: string[]): void => {
    events.forEach((event: string) => {
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
   * @param {string[]} events A list of events to unsubscribe from (e.g. 'device-update')
   */
  const unsubscribe = (subscriptionID: string, events: string[]): void => {
    events.forEach((event: string) => {
      if (typeof subscribtions.current[event] !== 'undefined') {
        subscribtions.current[event] = subscribtions.current[event].filter(
          (subscription: Subscription) => subscription.subscriptionID !== subscriptionID
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
    (msg: CliRequestMsg): void => {
      const isSecretNeeded = !WITHOUT_SECRET.current.includes(msg.event);
      if (isSecretNeeded) {
        msg.secret = secret.current;
      }

      if (
        ws.current !== null &&
        ws.current.readyState === WebSocket.OPEN &&
        (!isSecretNeeded || secret.current !== null)
      ) {
        ws.current.send(JSON.stringify(msg));
      } else {
        // store the message. It will be send, when the websocket reconnects.
        sends.current.push(msg);

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
    (
      msg: CliRequestMsg | CliValidateMsg,
      callback: (msg: SrvAnswerMsg | SrvValidateMsg) => void
    ) => {
      if (msg.event === 'user-validate') {
        /* 
          Coming from the login form the message, including the user to validate with email, password, istest, 
          is 'buffered' until the challenge / response cycle is completet.
        */
        setValidationRequest({ msg, callback });
      } else {
        const requestID = createUUID();
        msg.requestID = requestID;
        requests.current[requestID] = { msg, callback } as Request;
      }

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const isSecretNeeded = !WITHOUT_SECRET.current.includes(msg.event);
        if (isSecretNeeded && typeof secret.current === 'undefined') {
          return;
        }

        if (isSecretNeeded) msg.secret = secret.current;
        // console.log(`Socket is open. Sending request '${msg.event}' to the server`);
        ws.current.send(JSON.stringify(msg));
      } else {
        if (!isReconnecting.current) startRetryTimeout(retryCount, true);
      }
    },
    [startRetryTimeout, retryCount]
  );

  /**
    Put the current user in the context of the application.
    This also adds him to the reconnect message to be send when reconnecting the websocket.
    @param {object} theUser The user that was provided by the login form.
    @param {boolean} isNavigateToHome If true, navigate to the home page of the user after login
  */
  const login = useCallback(
    (theUser: User, isNavigateToHome: boolean): void => {
      reconnectMsg.current.data.user = theUser;
      if (theUser.istest) setIsTest(theUser.istest);
      setUser(theUser);
      console.log(`Loggin in user '${theUser.alias}'`);
      if (isNavigateToHome) navigate(theUser.home);
    },
    [navigate]
  );

  const logout = useCallback((): void => {
    // ws.current.close(4001, 'User logged out');
    setUser(null);
  }, []);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      reconnectMsg.current.data.user = null;
    }
  }, [user]);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    When this effect is executed, a new WebSocket is created that will directly
    connect to the server. Rerunning the effect reconnects when the socket was closed.
  */
  useEffect(() => {
    if (ws.current === null || (isReconnecting && ws.current.readyState !== WebSocket.OPEN)) {
      publishEvent('lastUpdatedAt', 'connecting');
      const wsurl = import.meta.env.DEV ? window.scconfig.WSURL : window.scconfig.WSSURL;
      console.log(`Creating websocket connection to ${wsurl}`);
      // ws.current = new websocket.w3cwebsocket(wsurl);
      ws.current = new WebSocket(wsurl);
    }

    ws.current.onerror = (e) => console.error(e);

    ws.current.onopen = () => {
      isReconnecting.current = false;
      publishEvent('lastUpdatedAt', Date.now());
      console.log(`WebSocket connection opened for Shelly Context!`);

      if (validationRequest && ws.current && validationRequest.msg.data.user) {
        console.log('Sending an existing validation request');
        /*
          Don't send the password! Instead digest authentication will be used.
          So this will provoke an 401 error.
        */
        ws.current.send(
          JSON.stringify({
            event: 'user-validate',
            source: validationRequest.msg.source,
            message: validationRequest.msg.message,
            data: {
              user: { email: validationRequest.msg.data.user.email },
            },
          } as CliValidateMsg)
        );
      } else if (ws.current && reconnectMsg.current.data.user) {
        console.log(
          `Reconnecting the previously logged in user '${reconnectMsg.current.data.user.alias}' on websocket open`
        );
        // this will send a message with a channelID. Used to manage the connection on the serverside!
        ws.current.send(JSON.stringify(reconnectMsg.current));
      }

      /*
        send all requests that don't need a secret 
      */
      Object.values(requests.current).forEach((aRequest) => {
        if (WITHOUT_SECRET.current.includes(aRequest.msg.event) && ws.current) {
          console.log(`Sending request '${aRequest.msg.event}' after opening the websocket`);
          try {
            ws.current.send(JSON.stringify(aRequest.msg));
          } catch (e) {
            console.error(e);
          }
        }
      });
    };

    ws.current.onmessage = (event) => {
      publishEvent('lastUpdatedAt', Date.now());
      const msg = JSON.parse(event.data);

      if (msg !== null) {
        if (msg.event === 'user-validate' && validationRequest?.msg.data.user && ws.current) {
          if (typeof msg.data.error !== 'undefined' && msg.data.error.code === 401) {
            // Not authenticated. Add the credentials to the message

            validationRequest.msg.data.auth = getWSCredentials(
              msg.data.error,
              validationRequest.msg.data.user.password,
              validationRequest.msg.data.user.email
            );
            delete validationRequest.msg.data.user.password;
            delete validationRequest.msg.data.error;
            // Retry with challenge response object
            ws.current.send(JSON.stringify(validationRequest.msg));
          } else {
            // authenticated: forward the message to userform to perform a login
            secret.current = msg.secret;
            delete msg.secret;

            validationRequest.callback(msg);
            console.log(
              `Successfully validated ${validationRequest.msg.data.user.email} and deleted the 'user-validate' request. Now have ${Object.values(requests.current).length} requests left`
            );
            setValidationRequest(undefined);

            if (msg.data.user) {
              // this will send a message with a channelID. Used to manage the connection on the serverside!
              reconnectMsg.current.data.user = msg.data.user;
              if (reconnectMsg.current.data.user !== null) {
                console.log(
                  `Connecting the previously logged in user '${reconnectMsg.current.data.user.alias}' after successful validation`
                );

                ws.current.send(JSON.stringify(reconnectMsg.current));
              }
            }
          }
        } else if (msg.event === 'user-reconnect') {
          // the secret must be send with every request
          if (typeof msg.secret !== 'undefined' && reconnectMsg.current.data.user) {
            const connectedUser = reconnectMsg.current.data.user;
            console.log(
              `Just reconnected with user ${connectedUser.alias}. There are ${Object.entries(requests.current).length} outstanding requests`
            );
            secret.current = msg.secret;
            login(connectedUser, true);
            /*
              Send all requests that arrived while the socket was not open and that need a secret
            */
            Object.values(requests.current).forEach((aRequest) => {
              if (
                !WITHOUT_SECRET.current.includes(msg.event) &&
                ws.current &&
                typeof secret.current !== 'undefined'
              ) {
                aRequest.msg.secret = secret.current;
                console.log(`Sending request '${aRequest.msg.event}' after reconnecting.`);
                ws.current!.send(JSON.stringify(aRequest.msg));
              }
            });

            /*
              Send all outstanding messages that arrived while the socket was not open
              and  don't expect an answer from the server
            */
            sends.current.forEach((wsMsg: CliRequestMsg) => {
              console.log(`Sending message '${wsMsg.event}' after reconnecting`);
              try {
                if (ws.current) ws.current.send(JSON.stringify(wsMsg));
              } catch (e) {
                console.error(e);
              }
            });
            sends.current = [];
          } else {
            // reconnect unsuccessfull: logout
            console.error('Reconnecting was not possible. Logging out!');
            logout();
          }
        } else if (msg.event === 'ping' && ws.current) {
          /*
            the server sent a ping! Answer with pong to
            make clear that this socket is still alive.
          */
          ws.current.send(
            JSON.stringify({
              event: 'pong',
              source: 'SC Context',
              message: msg.message,
              data: {},
            })
          );
        } else if (
          typeof msg.requestID !== 'undefined' &&
          typeof requests.current[msg.requestID] !== 'undefined'
        ) {
          /*
            Find the request with the provided id and forward the message
            to the stored callback function
          */
          const requestID = msg.requestID;
          delete msg.requestID; // remove the requestID from the message
          requests.current[requestID].callback(msg);
          delete requests.current[requestID];
          console.log(
            `Deleted request '${msg.event}' on answer: '${msg.message}'. Now have ${Object.entries(requests.current).length} requests`
          );
        } else if (typeof msg.event !== 'undefined') {
          /*
            Forward the message to the registered / subscribed callback
            functions for the given msg.event.
          */
          if (typeof subscribtions.current[msg.event] !== 'undefined') {
            subscribtions.current[msg.event].forEach((subscription) => {
              if (subscription.all || msg.subscriptionID === subscription.subscriptionID) {
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
      }

      if (ws.current) {
        console.log(
          `WebSocket connection closed by the server with code ${e.code} for SC Context. Reason: ${e.reason}!`
        );
      } else {
        console.log(
          `WebSocket connection closed because SC Context was unmounted. Reason: ${e.reason}!`
        );
      }
    };
  }, [validationRequest, startRetryTimeout, retryCount, logout, user, login]);
  // --------------------- Websocket Implementation END----------------

  return (
    <ShellyContext.Provider
      value={useMemo(
        () => ({ user, login, logout, subscribe, unsubscribe, request, send, isTest }),
        [user, login, logout, request, send, isTest]
      )}
    >
      {children}
    </ShellyContext.Provider>
  );
};
