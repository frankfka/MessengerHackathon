const { logger } = require('../logger');
const messengerConstants = require('./constants')
const conversationState = require('../state/conversationState');
const sendFunctions  = require('./sendFunctions');

// Handles messaging_postbacks events and returns a new conversation state
function handlePostback(senderId, currentState, postbackContent) {
  // Get the current state code
  let currentStateCode = currentState[conversationState.STATE_CURR_STATE_KEY]

  // Process based on the current state
  switch (currentStateCode) {
    case conversationState.STATE_INIT:
      return handlePostbackForInitState(senderId, currentState, postbackContent)
    case conversationState.STATE_INITIAL_OPTIONS_SENT:
      return handlePostbackForInitialOptionsSentState(senderId, currentState, postbackContent)
  }
}

function handlePostbackForInitState(senderId, currentState, postbackContent) {
  if (postbackContent.payload === messengerConstants.POSTBACK_GET_STARTED_PAYLOAD) {
    // Send greeting message
    sendFunctions.sendInitialGreeting(senderId)
    // Process new state
    return conversationState.getNewState(currentState, conversationState.getSendInitialOptionsAction())
  }
  logger.error("Initial state but postback is not of form GET_STARTED")
  logger.error(postbackContent)
  logger.error(currentState)
}

function handlePostbackForInitialOptionsSentState(senderId, currentState, postbackContent) {
  if (postbackContent.payload === messengerConstants.POSTBACK_BOOK_APPT_PAYLOAD) {
    // Send available therapists
    // TODO: Call API
    sendFunctions.sendAvailableTherapists(senderId, [
      {
        id: "any",
        fullName: "Any"
      },
      {
        id: "johndoe",
        fullName: "John Doe"
      },
      {
        id: "janesmith",
        fullName: "Jane Smith"
      },
    ])
    // Process new state
    return conversationState.getNewState(currentState, conversationState.getBookAppointmentAction())
  }
  // User clicked on "talk to human"
  sendFunctions.sendMessage(senderId, "Someone will be with you shortly!")
  return conversationState.getNewState(currentState, conversationState.getSpeakToHumanAction())
}


module.exports = {
  handlePostback
}