/*
  Author: André Kreienbring  
  Used for a digest authetication scheme during user validation
*/
const crypto = require("crypto");
const endecrypt = require("@src/utils/endecrypt.js");

const REALM = "ShellyBroker";

const CHALLENGE_ERROR = {
  code: 401,
  message: {
    auth_type: "digest",
    nc: 1,
    realm: REALM,
    algorithm: "SHA-256",
  },
};

/**
  Creates the error for the challenge - response Digest Cycle
  @return {object} The challenge message with a one time nonce
*/
function getChallengeError() {
  CHALLENGE_ERROR.nonce = crypto.randomBytes(16).toString("base64");
  return CHALLENGE_ERROR;
}

/**
  Validates a user upon the send authetication values.
  @param {object} dbUser An existing user from the db with his HA1 value
  @param {string} auth The authentication data a client sent upon a digest challenge.
  @return {boolean} True if the digest response is valid, false if not.
*/
function validate(dbUser, auth) {
  const correctResponse = endecrypt.hexHash(
    `${dbUser.HA1}:${auth.nonce}:1:${auth.cnonce}`,
    "sha256"
  );
  return auth.response === correctResponse;
}

module.exports = { getChallengeError, validate, REALM };
