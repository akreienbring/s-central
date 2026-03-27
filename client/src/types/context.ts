/*
  Author: André Kreienbring
  Types used in the Shelly Context
*/
import type { User } from '@src/types/user';

/*
  The shelly context makes this values / functions available in all components
*/
export type SContext = {
  request: (
    msg: CliRequestMsg | CliValidateMsg,
    callback: (msg: SrvAnswerMsg | SrvValidateMsg) => void
  ) => void;
  subscribe: (subscription: Subscription, events: string[]) => void;
  unsubscribe: (subscriptionID: string, events: string[]) => void;
  send: (msg: CliRequestMsg) => void;
  login: (user: User, isNavigateToHome: boolean) => void;
  logout: () => void;
  user: User | null;
  isTest: boolean;
};

/*
  Components request data from the server.
  The request object is then maintained by the context until
  the answer arrives which is then forwarded to the requesting component
*/
export type Request = {
  msg: CliRequestMsg;
  callback: (msg: SrvAnswerMsg) => void;
};

/*
  There are two types of requests.
  - 'normal' requests e.g. for data, server action...
  - a special request for validation that is used in the digest challenge / response cycle.
*/
export type ValidationRequest = {
  msg: CliValidateMsg;
  callback: (msg: SrvValidateMsg) => void;
};

/**
  SContext buffers every ws request until an answer from the ws server is received
  To use this in typescript we need an index signature witch the requestID (string) as index
*/
export type RequestBuffer = {
  [key: string]: Request;
};

/*
  Components may subcribe to server events (e.g. device-update)
  Subscriptions are maintained by the context.
*/
export type Subscription = {
  subscriptionID: string;
  callback: (msg: SrvEventMsg) => void;
  all: boolean;
};

/**
  SContext buffers all subscription to ws events. This index signature is used
  to access buffered subscriptions by the event name (string).
 */
export type SubscriptionBuffer = {
  [key: string]: Subscription[];
};
