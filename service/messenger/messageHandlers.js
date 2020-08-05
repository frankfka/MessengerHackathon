const { logger } = require('../logger');
const messengerConstants = require('./constants')
const conversationState = require('../state/conversationState');
const sendFunctions  = require('./sendFunctions');

// TODO: Comment this, add logging

// Handles messages events, returns a new state
function handleMessage(senderId, currentState, receivedMessage) {
  // Get the current state code
  let currentStateCode = currentState[conversationState.STATE_CURR_STATE_KEY]

  // Process based on the current state
  switch (currentStateCode) {
    case conversationState.STATE_INIT:
      return handleMessageForInitState(senderId, currentState)
    case conversationState.STATE_BOOK_REQUESTED:
      return handleMessageForBookRequestedState(senderId, currentState, receivedMessage)
    case conversationState.STATE_BOOK_THERAPIST_PICKED:
      return handleMessageForTherapistPickedState(senderId, currentState, receivedMessage)
    case conversationState.STATE_BOOK_TIME_PICKED:
      return handleMessageForBookTimePickedState(senderId, currentState, receivedMessage)
  }
}

function handleMessageForInitState(senderId, currentState) {
  // Send greeting message
  sendFunctions.sendInitialGreeting(senderId)
  // Process new state
  return conversationState.getNewState(currentState, conversationState.getSendInitialOptionsAction())
}

function handleMessageForBookRequestedState(senderId, currentState, receivedMessage) {
  // Can process if a quick reply was chosen for the therapist name
  const therapistId = getQuickReplyPayload(receivedMessage)
  if (therapistId) {
    // TODO: Call API for available times and therapist info
    // Send available times
    sendFunctions.sendAvailableTimes(senderId, [], {})
    // Process new state
    return conversationState.getNewState(currentState, conversationState.getPickTherapistAction(therapistId))
  }
  // User sent something else
  sendFunctions.sendMessage(
    senderId,
    "Hmm, we don't quite recognize that. Someone will be with you shortly."
  )
}

function handleMessageForTherapistPickedState(senderId, currentState, receivedMessage) {
  // Can process if a quick reply was chosen for the booking time
  const pickedTime = getQuickReplyPayload(receivedMessage)
  if (pickedTime) {
    // Ask for phone number to confirm
    sendFunctions.inquireForPhoneNumber(senderId)
    // Process new state
    return conversationState.getNewState(currentState, conversationState.getPickTherapistAction(therapistId))
  }
  // User sent something else
  sendFunctions.sendMessage(
    senderId,
    "Hmm, we don't quite recognize that. Someone will be with you shortly."
  )
}

function handleMessageForBookTimePickedState(senderId, currentState, receivedMessage) {
  // Assume any input is a phone number - would want to do some basic checks in the future
  let phoneNumber = receivedMessage.text
  const quickReplyPhoneNumber = getQuickReplyPayload(receivedMessage)
  if (quickReplyPhoneNumber) {
    phoneNumber = quickReplyPhoneNumber
  }

  sendFunctions.acknowledgeBookingRequestReceived(senderId)
  return conversationState.getNewState(
    currentState, conversationState.getGivePhoneNumberAction(phoneNumber)
  )
}

function getQuickReplyPayload(receivedMessage) {
  return receivedMessage["quick_reply"]
}

module.exports = {
  handleMessage
}