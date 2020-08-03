const axios = require('axios');
const { logger } = require('../logger');
const messengerConsts = require('./constants')
const secrets = require('../../secrets')


// Initialize Get Started Button
function initWelcomeScreen() {
  // Construct the message body
  let reqBody = {
    "get_started": {
      payload: messengerConsts.POSTBACK_GET_STARTED_PAYLOAD
    },
    "greeting": [
      {
        locale: "default",
        text: "Hello {{user_first_name}}!"
      }
    ]
  }
  callMessengerAPI("https://graph.facebook.com/v2.6/me/messenger_profile", reqBody)
  .then(function (response) {
    logger.info("Welcome screen initialized for Messenger.")
  })
  .catch(function (error) {
    logger.error("Error initializing welcome screen.")
    logger.error(error)
  })
}

// Sends response messages via the Send API
function callSendAPI(senderId, messageContent) {
  // Create the request body
  let requestBody = {
    recipient: {
      id: senderId
    },
    message: messageContent
  }
  callMessengerAPI("https://graph.facebook.com/v2.6/me/messages", requestBody)
  .then(function (response) {
    logger.info("Send message response")
    // handle success
    logger.info(response.data);
  })
  .catch(function (error) {
    // handle error
    logger.info(error);
  })
}

// Sends a generic request to Messenger API
async function callMessengerAPI(endpoint, reqBody) {
  logger.info(`Calling ${endpoint} with request:`)
  logger.info(reqBody)
  let requestParams = { access_token: secrets.ACCESS_TOKEN }
  return axios.post(endpoint, reqBody, {
    params: requestParams
  })
}

module.exports = { initWelcomeScreen, callSendAPI }