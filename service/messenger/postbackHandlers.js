const { callSendAPI } = require('./common');
const { logger } = require('../logger');
const messengerConsts = require('./constants')

// Handles messaging_postbacks events
function handlePostback(senderId, received_postback) {
  let response;

  logger.info("Handling Postback:")
  logger.info(received_postback)

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === messengerConsts.POSTBACK_GET_STARTED_PAYLOAD) {
    logger.info("Handling get started")
    response = handlePostbackGetStarted(received_postback)
  } else if (payload === messengerConsts.POSTBACK_BOOK_APPT_PAYLOAD) {
    response = handlePostbackBookAppointment(received_postback)
  } else {
    response = null;
  }

  // Send the message to acknowledge the postback
  if (response) {
    callSendAPI(senderId, response);
  }
}

/**
 * When user taps Get Started
 * - Show available options: Book an Appointment or Speak to a Representative
 */
function handlePostbackGetStarted(postback) {
  if (postback.payload !== messengerConsts.POSTBACK_GET_STARTED_PAYLOAD) {
    return
  }
  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What would you like to do?",
        "buttons": [
          {
            "type": "postback",
            "title": "Book an Appointment",
            "payload": messengerConsts.POSTBACK_BOOK_APPT_PAYLOAD,
          }, {
            "type": "postback",
            "title": "Speak to Someone",
            "payload": messengerConsts.POSTBACK_SPEAK_TO_PERSON_PAYLOAD,
          }
        ]
      }
    }
  }
}

function handlePostbackBookAppointment(postback) {
  if (postback.payload !== messengerConsts.POSTBACK_BOOK_APPT_PAYLOAD) {
    return
  }
  return {
    "text": "Let's get started! We need your phone number to begin.",
    "quick_replies": [{
      "content_type": "user_phone_number"
    }]
  }
}

module.exports = {
  handlePostback
}