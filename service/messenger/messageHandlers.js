const { callSendAPI } = require('./common');
const { logger } = require('../logger');

// Handles messages events
function handleMessage(senderId, received_message) {

  logger.info("Handling Message")
  logger.info(received_message)

  let response;
  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}"`
    }
  }
  // Sends the response message
  callSendAPI(senderId, response);
}

module.exports = {
  handleMessage
}