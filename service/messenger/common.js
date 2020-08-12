const axios = require('axios');
const { logger } = require('../logger');
const messengerConsts = require('./constants');
const secrets = require('../../secrets');

// Sends a generic request to Messenger API
async function callMessengerAPI(endpoint, reqBody) {
  logger.info(`Calling ${endpoint} with request:`);
  logger.info(reqBody);
  const requestParams = { access_token: secrets.ACCESS_TOKEN };
  return axios.post(endpoint, reqBody, {
    params: requestParams,
  });
}

// Initialize Get Started Button
function initWelcomeScreen() {
  // Construct the message body
  const reqBody = {
    get_started: {
      payload: messengerConsts.POSTBACK_GET_STARTED_PAYLOAD,
    },
    greeting: [
      {
        locale: 'default',
        text: 'Hello {{user_first_name}}!',
      },
    ],
  };
  callMessengerAPI('https://graph.facebook.com/v2.6/me/messenger_profile', reqBody)
    .then(() => {
      logger.info('Welcome screen initialized for Messenger.');
    })
    .catch((error) => {
      logger.error('Error initializing welcome screen.');
      logger.error(error);
    });
}

// Sends response messages via the Send API
function callSendAPI(senderId, oneTimeNotifToken, messageContent) {
  let recipientData = {
    id: senderId,
  };
  if (oneTimeNotifToken) {
    recipientData = {
      one_time_notif_token: oneTimeNotifToken,
    };
  }
  // Create the request body
  const requestBody = {
    recipient: recipientData,
    message: messageContent,
  };
  callMessengerAPI('https://graph.facebook.com/v8.0/me/messages', requestBody)
    .then((response) => {
      logger.info('Send message response');
      logger.info(response.data);
    })
    .catch((error) => {
    // handle error
      logger.info(error);
    });
}

module.exports = { initWelcomeScreen, callSendAPI };
