const { STATE_SENDER_ID_KEY } = require('../state/conversationState');
const { callSendAPI } = require('./common');
const { logger } = require('../logger');

// Handles messages events, returns a new state
function handleMessage(conversationState, receivedMessage) {
  let senderId = conversationState[STATE_SENDER_ID_KEY]
  if (!senderId) {
    logger.error("No sender ID in state")
    logger.error(conversationState)
    return null
  }

  logger.info("Handling Message")
  logger.info(receivedMessage)

  let response;
  // Check if the message contains text
  if (receivedMessage.text) {
    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${receivedMessage.text}"`
    }
  }
  // Sends the response message
  callSendAPI(senderId, response);
}

module.exports = {
  handleMessage
}