/*
  Author: André Kreienbring  
  Provides functions that implement the Shelly Authentication (client) mechanism
  like documented here:
  https://shelly-api-docs.shelly.cloud/gen2/General/Authentication
  The original code was copied from an Allterco example here:
  https://github.com/ALLTERCO/gen2-sample-code
*/
const crypto = require("crypto");
const endecrypt = require("@src/utils/endecrypt.js");

const shellyHttpHashAlgo = "sha256";
const shellyHttpUsername = "admin"; // always
const match_dquote_re = /^\"|\"$/g;
const match_coma_space_re = /,? /;
const static_noise_sha256 =
  ":auth:6370ec69915103833b5222b368555393393f098bfbfbb59f47e0590af135f062"; // = ':auth:'+hexHash("dummy_method:dummy_uri")

/*
  CURRENTLY UNUSED, BECAUSE SHELLY AUTHENTICATION DOES NOT REQUIRE A HEADER
  Creates a Digest Authorization header.
  @param {object} authParams Must already contain the valid credential properties
  @param {object} headers Can contain predefined headers or may be empty
  @return {object} The input headers with the added Authorization header.
*/
function buildHTTPAuthHeader(authParams, headers) {
  let origNonce = authParams.nonce;

  headers["Authorization"] =
    "Digest username='" +
    authParams.username +
    "'," +
    "realm='" +
    authParams.realm +
    "'," +
    "nonce='" +
    origNonce +
    "'," +
    "qop='auth',nc=1,uri:'/rpc/'," +
    "cnonce='" +
    authParams.cnonce +
    "'," +
    "response='" +
    authParams.response +
    "'," +
    "algorithm='SHA-256'";

  return headers;
}

/*
  Used to check if the values, that were extracted from an Authentication
  header, are valid.
  @param {object} authParams An object with the extracted values
  @return {boolean} true if the values are valid, false if not.
*/
function isauthParams(authParams) {
  return (
    typeof authParams !== "undefined" &&
    typeof authParams == "object" &&
    typeof authParams.nonce == "string" &&
    typeof authParams.realm == "string" &&
    typeof authParams.algorithm == "string"
  );
}

/*
  Build the digest credentials that will be passed to the device
  @param {object} message The message with the challenge information
  @param (string) password The password that protects the device
  @return {object} The authentication parameters
*/
function getWSCredentials(message, password) {
  if (typeof password === "undefined" || password === "") {
    throw new Error("Failed to authenticate!  Please supply a password!");
  }

  if (typeof message === "undefined" || message.auth_type !== "digest") {
    throw new Error("The message contains no authentication information");
  }

  const authParams = {
    nonce: message.nonce,
    nc: message.nc,
    realm: message.realm,
    algorithm: message.algorithm,
  };
  return complementAuthParams(authParams, password);
}

/*
  Build the digest credentials that will be passed to the device
  as a response to the authentication callenge in the header
  @param {array} headers The headers with the challenge information
  @param (string) password The password that protects the device
  @return {object} The authentication parameters
*/
function getHTTPCredentials(headers, password) {
  if (typeof password === "undefined" || password === "") {
    throw new Error("Failed to authenticate!  Please supply a password!");
  }

  //look up the challenge header
  const authHeader = headers["www-authenticate"];

  if (typeof authHeader === "undefined") {
    throw new Error("WWW-Authenticate header is missing in the response?!");
  }

  console.log("Generating credentials from given header");
  let authParams = extractAuthParams(authHeader);
  return complementAuthParams(authParams, password);
}

/*
  After the extraction of values from the Authentication header
  that was send by a protected Shelly device, the user credentials
  are added. Implements the documented way to create the credentials.
  @param {object} authParams The initial paramter object with the extracted values
  @param {string} password The password the user must provide to access the device
  @return {object} The input authParams object with added credential values.
*/
function complementAuthParams(authParams, password) {
  authParams.username = shellyHttpUsername;
  authParams.cnonce = String(Math.floor(Math.random() * 10e8));

  let resp = endecrypt.hexHash(
    `${authParams.username}:${authParams.realm}:${password}`,
    shellyHttpHashAlgo
  );
  resp += `:${authParams.nonce}`;
  resp += `:1:${authParams.cnonce}${static_noise_sha256}`;

  authParams.response = endecrypt.hexHash(resp, shellyHttpHashAlgo);
  return authParams;
}

/*
  An access to a protected Shelly device results in an "not authorized" errer 
  with code 401. The header of the respons contains details of the used real 
  (Shelly ID) and the used protection algorithm.
  This function extracs the relevant values that will then be used to initialize
  the authentication process.
  @param {string} authHeader The header that was send from the device upon the first request.
  @return {object} The object contains parameters extracted from the www-authenticate header.
*/
function extractAuthParams(authHeader) {
  let [authType, ...auth_parts] = authHeader.trim().split(match_coma_space_re);

  if (authType.toLocaleLowerCase() != "digest") {
    throw new Error(
      "WWW-Authenticate header is requesting unusual auth type " +
        authType +
        "instead of Digest"
    );
  }

  const authParams = {};
  for (let part of auth_parts) {
    let [_key, _value] = part.split("=");
    _value = _value.replace(match_dquote_re, "");

    if (_key == "algorithm" && _value != "SHA-256") {
      throw new Error(
        "WWW-Authenticate header is requesting unusual algorithm:" +
          _value +
          " instead of SHA-256"
      );
    }

    if (_key == "qop") {
      if (_value != "auth") {
        throw new Error(
          "WWW-Authenticate header is requesting unusial qop:" +
            _value +
            " instead of auth"
        );
      }
      continue;
    }

    authParams[_key.trim()] = _value.trim();
  }
  if (!isauthParams(authParams)) {
    throw new Error("invalid WWW-Authenticate header from device?!");
  }
  return authParams;
}

module.exports = { getHTTPCredentials, getWSCredentials };
