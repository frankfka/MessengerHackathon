const { logger } = require('../logger');
const messengerConstants = require('./constants')
const conversationState = require('../state/conversationState');
const sendFunctions  = require('./sendFunctions');
const bookingService = require('../bookingService');

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
  logger.error("Unhandled state for postback handler - returning.")
  logger.error(postbackContent)
  logger.error(currentState)
}

/*
Initial state - user probably clicked on Get Started - send initial options
 */
function handlePostbackForInitState(senderId, currentState, postbackContent) {
  if (postbackContent.payload === messengerConstants.POSTBACK_GET_STARTED_PAYLOAD) {
    // Send greeting message
    sendFunctions.sendInitialGreeting(senderId)
    // Process new state
    return conversationState.getNewState(currentState, conversationState.getSendInitialOptionsAction())
  }
}

/*
If user picked book appointment - send the list of available therapists
 */
function handlePostbackForInitialOptionsSentState(senderId, currentState, postbackContent) {
  if (postbackContent.payload === messengerConstants.POSTBACK_BOOK_APPT_PAYLOAD) {
    // Send available therapists
    const availableTherapists = bookingService.getAvailableTherapists()
    logger.info("Sending available therapists")
    logger.info(availableTherapists)
    sendFunctions.sendAvailableTherapists(senderId, availableTherapists)
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