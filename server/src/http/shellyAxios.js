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
  @param {string} url The url that is used for the request. MUST include parameters (if any) in case of GET
  @param {string} requestType Either "GET" or "POST"
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST parameters that will be send to the device.
  @param {string} password The password that is needed if the Authentication on the device is activated
  @returns {Promise} The (Axios) Promise that is either resolved or rejected by 'get' or 'digest'
*/
async function request(url, requestType, shellyMethod, params, password) {
  if (requestType === "GET") {
    return get(url);
  } else if (requestType === "POST") {
    return digest(url, shellyMethod, params, password);
  }
}

/**
  Performs a request with the POST method. If the device is not proteced, it will be successful 
  and the data will directly be returned to the caller.
  If the response status is 401 the user credentials and some conditions will be checked, 
  credentials will be added and the authorized request will be send again as a POST request.
  @param {string} url The url that is used for the request
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST parameters that will be send to the device.
  @param {string} password The password that is needed if the Authentication on the device is activated
  @returns {Promise} The Promise that is either resolved or rejected by 'shellyAxiosPOST'
*/
async function digest(url, shellyMethod, params, password) {
  // first POST without credentials
  return post(url, shellyMethod, params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err.message);
      const res = err.response;

      if (typeof res !== "undefined" && res.status === 401) {
        // Not authenticated. Add the credentials to the predefined standard body / payload
        body.auth = shellyAuth.getHTTPCredentials(res.headers, password);

        // Retry with challenge response object
        return post(url, shellyMethod, params)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            throw new Error("Failed to authenticate!  Wrong password?");
          });
      }
    });
}

/**
  Performs a GET request to the given URL.
  @param: {string} url The URL that will be called.
  @return: {Promise} 
    On a successful GET the Promise is resolved with the reponse.
    OR: The Promise is rejected with the error.
*/
async function get(url) {
  return axios.get(url, { headers: headers }).then((res) => {
    return res;
  });
}

/**
  Performs a POST request to the given URL.
  @param {string} url The URL that will be called.
  @param {string} shellyMethod The RPC method that is called on the shelly device. E.g. "Shelly.GetStatus"
  @param {object} params POST  parameters that will be send to the device. Maybe 'undefinded'
  @returns {Promise} 
    On a successful POST the Promise is resolved with the reponse.
    OR: The Promise is rejected with the error.
*/
async function post(url, shellyMethod, params) {
  // add the method to the predefined standard body
  body.method = shellyMethod;
  if (typeof params !== "undefined") body.params = params;
  return axios.post(url, body, { headers: headers }).then((res) => {
    return res;
  });
}

/**
  Called when axios produced an error and can be used to output error information
  @param {object} error mandatory The axis error
  @returns {object} A response object with error information
*/
function handleAxiosError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
    return error.response;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error("No Response Error", error.message);
    return {
      status: 404,
      error: "request error",
      message: "no response was received",
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Set Request Error: ", error.message);
    return {
      status: 500,
      error: "Internal Server Error",
      message: "request was not set up correctly",
    };
  }
}

module.exports = { get, post, request, handleAxiosError };
