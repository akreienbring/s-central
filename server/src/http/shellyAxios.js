/*
  Author: André Kreienbring  
  Implements general methods to request data with Axios. 
  Including a 'challenge - response' cycle for retrieving information 
  from a password protected Shelly device.
  The original code was copied from an Allterco example here:
  https://github.com/ALLTERCO/gen2-sample-code.

  Basically: The first request is a 'normal' request for an rpc method provided by 
  the device. (challenge) If the device is protected, it will send a "not Authorized" status code
  of 401. The used security algorithm will be extracted from the header and the given information 
  will be enhanced with the user credentials before sending the authorized request again. (response)

  This module uses 'axios' to implement this cycle.
*/
const axios = require("axios");
const shellyAuth = require("@src/utils/shelly-auth.js");
const endecrypt = require("@src/utils/endecrypt.js");

/*
  This interceptor throws an error if an axios error is not catched
*/
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  }
);
/*
  A predefined standard body with the RPC channel that will be used for the communication
  with the device. Number of RPC channels can range from 0-5.
  The body will be enhanced with properties during the process.
*/
const body = {
  id: 1,
};

/*
  A predefined standard header.
  The header can be enhanced with properties during the process.
*/
const headers = {
  "Content-Type": "application/json",
};

/**
  Performs a request of the given type. GET requests will be executed 'normally. 
  In the case of POST: 
    - If the device is not proteced, it will be successful 
      and the data will directly be returned to the caller.
    - If the device is protected, given credentials will be added and the request is repeated.
  @async
  @param {string} url The url that is used for the request. MUST include parameters (if any) in case of GET
  @param {string} requestType Either "GET" or "POST"
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST parameters that will be send to the device.
  @param {string} password The password that is needed if the Authentication on the device is activated
  @returns {Promise<object>} The (Axios) Promise that is either resolved or rejected by 'get' or 'digest'
*/
async function request(url, requestType, shellyMethod, params, password) {
  if (requestType === "GET") {
    return await get(url);
  } else if (requestType === "POST") {
    return await digest(url, shellyMethod, params, password);
  }
}

/**
  Performs a request with the POST method. If the device is not proteced, it will be successful 
  and the data will directly be returned to the caller.
  If the response status is 401 the user credentials and some conditions will be checked, 
  credentials will be added and the authorized request will be send again as a POST request.
  @async
  @param {string} url The url that is used for the request
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST parameters that will be send to the device.
  @param {string} password The password that is needed if the Authentication on the device is activated
  @returns {Promise<object>} The Promise that is either resolved with the response object or rejected with an error.
  @throws {Error} If the request fails or the authentication fails.
*/
async function digest(url, shellyMethod, params, password) {
  // first POST without credentials
  return await post(url, shellyMethod, params).catch(async (err) => {
    console.error(err.message);
    const res = err.cause.response;

    if (typeof res !== "undefined" && res.status === 401) {
      // Not authenticated. Add the credentials to the predefined standard body / payload
      body.auth = shellyAuth.getHTTPCredentials(res.headers, password);

      // Retry with challenge response object
      return await post(url, shellyMethod, params).catch((err) => {
        throw new Error("Failed to authenticate!  Wrong password?");
      });
    }
  });
}

/**
  Performs a GET request to the given URL.
  @async
  @param {string} url The URL that will be called.
  @param {string} [password] The password that is needed if the Authentication on the device is activated
  @returns {Promise<object>} 
    On a successful GET the Promise is resolved with the reponse.
    OR: The Promise is rejected with the error.
*/
async function get(url, password) {
  /*
    If a password is given, add the credentials to the url.
    This is used for basic authentication of Gen1 devices.
  */
  if (typeof password !== "undefined")
    url = url.replace("//", `//admin:${password}@`);

  return await axios.get(url, { headers: headers }).catch((err) => {
    handleAxiosError(err);
  });
}

/**
  Performs a POST request to the given URL.
  @async
  @param {string} url The URL that will be called.
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST  parameters that will be send to the device. Maybe 'undefinded'
  @returns {Promise<object>} 
    On a successful POST the Promise is resolved with the reponse.
    OR: The Promise is rejected with the error.
*/
async function post(url, shellyMethod, params) {
  // add the method to the predefined standard body
  body.method = shellyMethod;
  if (typeof params !== "undefined") body.params = params;
  return await axios.post(url, body, { headers: headers }).catch((err) => {
    handleAxiosError(err);
  });
}

/**
  CURRENTLY UNUSED! Performs a POST request to the given URL 
  for Gen1 devices that use basic authentication.
  @async
  @param {string} url The URL that will be called.
  @param {object} params POST  parameters that will be send to the device. Maybe 'undefinded'
  @param {string} [password] The password that is needed if the Authentication on the device is activated
  @returns {Promise<object>} 
    On a successful POST the Promise is resolved with the reponse.
    OR: The Promise is rejected with the error.
*/
async function postGen1(url, params, password) {
  /*
    If a password is given, add the credentials to the url.
    This is used for basic authentication of Gen1 devices.
  */
  const authHeaders = { ...headers };
  if (typeof password !== "undefined") {
    const base64 = endecrypt.encodeBase64(`admin:${password}`);
    authHeaders.Authorization = `Basic ${base64}`;
    // url = url.replace("//", `//admin:${password}@`);
  }

  if (typeof params !== "undefined") body.params = params;
  return await axios
    .post(url, body, {
      headers: authHeaders,
    })
    .catch((err) => {
      handleAxiosError(err);
    });
}

/**
  Convenience method that calles the devices rpc interfaces by using the POST method. 
  Supports the 'challenge - response' cycle for authentication if the device is protected.
  Only suitable for Gen2+ devices!
  @async
  @param {object} device The device the call will be send to.
  @param {string} method The RPC method that will be called.
  @param {object} [params] If provided this params will be added to the method.
  @returns {Promise<object>} The response object 
*/
async function postRPCMethod(device, method, params) {
  return await request(
    `http://${device.ip}/rpc/`,
    "POST",
    method,
    params,
    device.password
  );
}

/**
  Called when axios produced an error and can be used to output error information
  @param {object} err mandatory The axis error
  @returns {object} A response object with error information
*/
function handleAxiosError(err) {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw new Error(
      `Response Status Error: ${err.response.status}. Message: ${err.message}`,
      { cause: err }
    );
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    throw new Error(`No Response Error: Message: ${err.message}`, {
      cause: err,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(`Wrong Request Error: Message: ${err.message}`, {
      cause: err,
    });
  }
}

module.exports = { get, postRPCMethod, postGen1 };
