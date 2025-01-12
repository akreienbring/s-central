/*
  Author: André Kreienbring  
  Provides functions that implement the Shellybroker Authentication (client) mechanism
*/
import { createHash } from 'sha256-uint8array';

/*
  Uses the digest algorithm to encrypt a string
  @param {string} str The string to encrypt
*/
function hexHash(str) {
  return createHash().update(str).digest('hex');
}

/*
  Build the digest credentials that will be passed to the broker
  @param {object} msg The message with the challenge information
  @param (string) password The password that protects the device
  @param (string) email The mail address of an existing user.
  @return {object} The authentication parameters
*/
export function getWSCredentials(msg, password, email) {
  if (typeof password === 'undefined' || password === '') {
    throw new Error('Failed to authenticate!  Please supply a password!');
  }

  if (typeof msg === 'undefined' || msg.auth_type !== 'digest') {
    throw new Error('The message contains no authentication information');
  }

  const authParams = {
    nonce: msg.nonce,
    nc: msg.nc,
    realm: msg.realm,
    algorithm: msg.algorithm,
  };
  return complementAuthParams(authParams, password, email);
}

/*
  Create the auth params that will be added to the message that is send "onOpen".
  @param {object} authParams The initial paramter object with the extracted values
  @param {string} password The password the user must provide to access the device
  @param (string) email The mail address of an existing user.
  @return {object} The input authParams object with added credential values.
*/
function complementAuthParams(authParams, password, email) {
  authParams.username = email;
  authParams.cnonce = String(Math.floor(Math.random() * 10e8));

  let resp = hexHash(`${authParams.username}:${authParams.realm}:${password}`);
  resp += `:${authParams.nonce}`;
  resp += `:1:${authParams.cnonce}`;
  authParams.response = hexHash(resp);
  return authParams;
}
