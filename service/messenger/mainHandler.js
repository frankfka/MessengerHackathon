const { saveState } = require('../state/stateService');
const { handlePostback } = require('./postbackHandlers');
const { handleMessage } = require('./messageHandlers');
const { getState, deleteSavedState } = require('../state/stateService');
const { logger } = require('../logger');


function handleMessengerEvent(webhookEvent) {
  // Get the sender PSID
  let senderId = webhookEvent.sender.id;
  // Get the conversation state
  let conversationState = getState(senderId)

  logger.info("Handling Event")
  logger.info(webhookEvent)
  logger.info(conversationState)

  // Process state and event
  if (webhookEvent.message) {
    conversationState = handleMessage(senderId, conversationState, webhookEvent.message);
  } else if (webhookEvent.postback) {
    conversationState = handlePostback(senderId, conversationState, webhookEvent.postback);
  }

  // Save the new state
  if (conversationState) {
    saveState(conversationState)
  } else {
    logger.warn("New conversation state is null or undefined. Removing from database.")
    deleteSavedState(senderId)
  }
}

module.exports = {
  handleMessengerEvent
}