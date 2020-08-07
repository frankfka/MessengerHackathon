const { callSendAPI } = require('./common');
const messengerConsts = require('./constants')
const bookingService = require('../bookingService');

// TODO: Comment, set up eslint, deploy

// Generic send message
function sendMessage(senderId, message) {
  const response = {
    "text": message,
  }
  callSendAPI(senderId, response);
}

// Send greeting with available options to speak to a human or to book an appointment
function sendInitialGreeting(senderId) {
  const response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Hello! Thanks for getting in touch. Please let me know what you're looking for.",
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
  callSendAPI(senderId, response);
}

// Send available therapists through quick reply
// availableTherapists is an array of display-ready names
function sendAvailableTherapists(senderId, availableTherapists) {
  const quickReplies = availableTherapists.map((therapist) => {
    return {
      "content_type": "text",
      "title": therapist[bookingService.NAME_KEY],
      "payload": therapist[bookingService.ID_KEY],
    }
  })
  const response = {
    "text": "Awesome! Here are the available therapists at our location. Please let us know " +
      "who you want to book with.",
    "quick_replies": quickReplies
  }
  callSendAPI(senderId, response);
}

//
// " it seems like you want to book with ____ " - here are the next available times
// " We couldn't figure out the therapist that you're looking for, someone will be following up shortly!"
function sendAvailableTimes(senderId, availableTimes) {
  const quickReplies = availableTimes.map((time) => {
    return {
      "content_type": "text",
      "title": time[bookingService.AVAILABILITY_DISPLAY_KEY],
      "payload": time[bookingService.AVAILABILITY_DATA_KEY],
    }
  })
  const response = {
    "text": `Here are the available times. Please let us know what works best for you.`,
    "quick_replies": quickReplies
  }
  callSendAPI(senderId, response);
}

// Ask for phone number
function inquireForPhoneNumber(senderId) {
  const response = {
    "text": "Great! We just need a phone number to request this appointment.",
    "quick_replies": [{
      "content_type": "user_phone_number", // Payload will be the user's phone number
    }]
  }
  callSendAPI(senderId, response);
}

// Initial tentative confirmation
function acknowledgeBookingRequestReceived(senderId) {
  // TODO: Request one-time notif? https://developers.facebook.com/docs/messenger-platform/send-messages/one-time-notification
  const response = {
    "text": "Thank you so much! We will follow up shortly to confirm this booking.",
  }
  callSendAPI(senderId, response);
}

module.exports = {
  sendMessage,
  sendInitialGreeting,
  sendAvailableTherapists,
  sendAvailableTimes,
  inquireForPhoneNumber,
  acknowledgeBookingRequestReceived
}