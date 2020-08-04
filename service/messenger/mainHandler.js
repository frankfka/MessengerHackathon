const { saveState } = require('../state/stateService');
const { handlePostback } = require('./postbackHandlers');
const { handleMessage } = require('./messageHandlers');
const { getState } = require('../state/stateService');

function handleMessengerEvent(webhookEvent) {
  // Get the sender PSID
  let senderId = webhookEvent.sender.id;
  // Get the conversation state
  let conversationState = getState(senderId)

  // Process state and event
  if (webhookEvent.message) {
    conversationState = handleMessage(conversationState, webhookEvent.message);
  } else if (webhookEvent.postback) {
    conversationState = handlePostback(conversationState, webhookEvent.postback);
  }

  // Save the new state
  if (!conversationState) {
    saveState(conversationState)
  } else {
    // TODO: Error case
  }
}

module.exports = {
  handleMessengerEvent
}