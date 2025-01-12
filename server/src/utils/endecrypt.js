/*
  Author: André Kreienbring
  Used for en-, decryption.
  see: https://node.readthedocs.io/en/latest/api/crypto/
  for an explanation of sync or async usage.
*/
const { promisify } = require("util");
const crypto = require("crypto");
const randomBytesAsync = promisify(require("crypto").randomBytes);

/*
  Uses the digest algorithm to encrypt a string
  @param {string} str The string to encrypt
  @param {string} algorithm The algorithm that is used. E.g. "sha256"
*/
function hexHash(str, algorithm) {
  return crypto.createHash(algorithm).update(str).digest("hex");
}

/*
  Encrypt a user password. The resulting hash and salt values
  are stored with the users db entry.
  @param: {string} password The users password
  @return {object} The hash  and salt values that were used to hash the password.
*/
async function encrypt(password) {
  const salt = await randomBytesAsync(16);

  // Hashing user's salt and password with 100 iterations, 64 length and sha512 digest
  const hash = crypto
    .pbkdf2Sync(password, salt, 100, 64, `sha512`)
    .toString(`hex`);

  return { hash, salt };
}

/* 
  Method to check the entered password is correct or not.
  Concept: Using the same salt and the same password MUST create the same hash!
  @param {string} The provided password from a login request.
  @param {string} The hash that was created from the correct password (in db)
  @param {string} The salt that was used to create the hash
  @return {boolean} true if the password is correct, false otherwise.
*/
function validate(password, hash, salt) {
  const newhash = crypto
    .pbkdf2Sync(password, salt, 100, 64, `sha512`)
    .toString(`hex`);

  return newhash === hash;
}

function encryptUserHA1(username, realm, password) {
  return hexHash(`${username}:${realm}:${password}`, "sha256");
}

function createUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

module.exports = {
  encrypt,
  validate,
  encryptUserHA1,
  hexHash,
  createUUID,
};
