/*
  Author: André Kreienbring  
  Provides functions that implement the Shellybroker Digest Authentication (client) mechanism
*/
import type { AuthError, AuthParams } from '../types/digest-auth';

import { createHash } from 'sha256-uint8array';

/**
  Uses the digest algorithm to encrypt a string
  @param {string} str The string to encrypt
  @returns {string} The encrypted string
*/
function hexHash(str: string): string {
  return createHash().update(str).digest('hex');
}

/**
  Build the digest credentials that will be passed to the broker
  @param {authError} error The error object with code, message and nonce
  @param {string} password The password that protects the device
  @param {string} email The mail address of an existing user.
  @returns {authParams} The authentication parameters
*/
export function getWSCredentials(error: AuthError, password?: string, email?: string): AuthParams {
  if (typeof password === 'undefined' || password === '') {
    throw new Error('Failed to authenticate!  Please supply a password!');
  }

  if (typeof email === 'undefined' || email === '') {
    throw new Error('Failed to authenticate!  Please supply an email!');
  }

  if (typeof error.message === 'undefined' || error.message.auth_type !== 'digest') {
    throw new Error('The message contains no authentication information');
  }

  const authParams = {
    nonce: error.nonce,
    nc: error.message.nc,
    realm: error.message.realm,
    algorithm: error.message.algorithm,
  };
  return complementAuthParams(authParams, password, email);
}

/**
  Create the auth params that will be added to the message that is send "onOpen".
  @param {object} authParams The initial paramter object with the extracted values
  @param {string} password The password the user must provide to access the device
  @param (string) email The mail address of an existing user.
  @return {object} The input authParams object with added credential values.
*/
function complementAuthParams(authParams: AuthParams, password: string, email: string): AuthParams {
  authParams.username = email;
  authParams.cnonce = String(Math.floor(Math.random() * 10e8));

  let resp = hexHash(`${authParams.username}:${authParams.realm}:${password}`);
  resp += `:${authParams.nonce}`;
  resp += `:1:${authParams.cnonce}`;
  authParams.response = hexHash(resp);
  return authParams;
}
