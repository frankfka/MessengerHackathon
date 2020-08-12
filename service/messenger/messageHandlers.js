const { logger } = require('../logger');
const conversationState = require('../state/conversationState');
const sendFunctions = require('./sendFunctions');
const bookingService = require('../bookingService');

/*
Retrieve quick reply payload, or return null
 */
function getQuickReplyPayload(receivedMessage) {
  if (receivedMessage.quick_reply) {
    return receivedMessage.quick_reply.payload;
  }
  return null;
}

/*
Initial state - send greeting with booking/ask a question options
 */
function handleMessageForInitState(senderId, currentState) {
  // Send greeting message
  sendFunctions.sendInitialGreeting(senderId);
  // Process new state
  return conversationState.getNewState(
    currentState, conversationState.getSendInitialOptionsAction(),
  );
}

/*
Booking requested - message should have therapistId as a quick reply - send available times
 */
function handleMessageForBookRequestedState(senderId, currentState, receivedMessage) {
  // Can process if a quick reply was chosen for the therapist name
  const therapistId = getQuickReplyPayload(receivedMessage);
  if (therapistId) {
    const availableTimes = bookingService.getAvailableTimes(therapistId);
    logger.info('User picked therapist. Sending available times.');
    logger.info(availableTimes);
    // Send available times
    sendFunctions.sendAvailableTimes(senderId, availableTimes);
    // Process new state
    return conversationState.getNewState(
      currentState, conversationState.getPickTherapistAction(therapistId),
    );
  }
  // User sent something else
  sendFunctions.sendMessage(
    senderId,
    "Hmm, we don't quite recognize that. Someone will be with you shortly.",
  );
  return null;
}

/*
Therapist picked - new message should have picked time quick reply - now inquire for phone number
 */
function handleMessageForTherapistPickedState(senderId, currentState, receivedMessage) {
  // Can process if a quick reply was chosen for the booking time
  const pickedTimeId = getQuickReplyPayload(receivedMessage);
  if (pickedTimeId) {
    logger.info('User picked time. Asking for phone number');
    logger.info(pickedTimeId);
    // Ask for phone number to confirm
    sendFunctions.inquireForPhoneNumber(senderId);
    // Process new state
    return conversationState.getNewState(
      currentState, conversationState.getPickTimeAction(pickedTimeId),
    );
  }
  // User sent something else
  sendFunctions.sendMessage(
    senderId,
    "Hmm, we don't quite recognize that. Someone will be with you shortly.",
  );
  return null;
}

/*
Phone number given - send a tentative booking request confirmation
 */
function handleMessageForBookTimePickedState(senderId, currentState, receivedMessage) {
  // Assume any input is a phone number - would want to do some basic checks in the future
  let phoneNumber = receivedMessage.text;
  const quickReplyPhoneNumber = getQuickReplyPayload(receivedMessage);
  if (quickReplyPhoneNumber) {
    phoneNumber = quickReplyPhoneNumber;
  }

  // Acknowledge request and ask for follow up permission
  sendFunctions.acknowledgeBookingRequestReceived(senderId);
  sendFunctions.askPermissionForFollowUp(senderId);
  return conversationState.getNewState(
    currentState, conversationState.getGivePhoneNumberAction(phoneNumber),
  );
}

/*
Tentative Booking confirmation is sent
 */
function handlePhoneNumberConfirmedState(currentState) {
  // No action needed, return current state
  return currentState;
}

// Handles messages events, returns a new state
function handleMessage(senderId, currentState, receivedMessage) {
  // Get the current state code
  const currentStateCode = currentState[conversationState.STATE_CURR_STATE_KEY];

  // Process based on the current state
  switch (currentStateCode) {
    case conversationState.STATE_INIT:
      return handleMessageForInitState(senderId, currentState);
    case conversationState.STATE_BOOK_REQUESTED:
      return handleMessageForBookRequestedState(senderId, currentState, receivedMessage);
    case conversationState.STATE_BOOK_THERAPIST_PICKED:
      return handleMessageForTherapistPickedState(senderId, currentState, receivedMessage);
    case conversationState.STATE_BOOK_TIME_PICKED:
      return handleMessageForBookTimePickedState(senderId, currentState, receivedMessage);
    case conversationState.STATE_PHONE_CONFIRMED:
      return handlePhoneNumberConfirmedState(currentState);
    default:
      break;
  }
  logger.error('Unhandled state for message handler - returning.');
  logger.error(receivedMessage);
  logger.error(currentState);
  return null;
}

module.exports = {
  handleMessage,
};
