const { callSendAPI } = require('./common');
const messengerConsts = require('./constants');
const bookingService = require('../bookingService');

/*
Send a generic message
 */
function sendMessage(senderId, message) {
  const response = {
    text: message,
  };
  callSendAPI(senderId, null, response);
}

/*
Send greeting with available options to speak to a human or to book an appointment
 */
function sendInitialGreeting(senderId) {
  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: "Hello! Thanks for getting in touch. Please let me know what you're looking for.",
        buttons: [
          {
            type: 'postback',
            title: 'Book an Appointment',
            payload: messengerConsts.POSTBACK_BOOK_APPT_PAYLOAD,
          }, {
            type: 'postback',
            title: 'Speak to Someone',
            payload: messengerConsts.POSTBACK_SPEAK_TO_PERSON_PAYLOAD,
          },
        ],
      },
    },
  };
  callSendAPI(senderId, null, response);
}

/*
Send available therapists through quick reply
 */
function sendAvailableTherapists(senderId, availableTherapists) {
  const quickReplies = availableTherapists.map((therapist) => ({
    content_type: 'text',
    title: therapist[bookingService.NAME_KEY],
    payload: therapist[bookingService.ID_KEY],
  }));
  const response = {
    text: 'Awesome! Here are the available therapists at our location. Please let us know '
      + 'who you want to book with.',
    quick_replies: quickReplies,
  };
  callSendAPI(senderId, null, response);
}

/*
Send a list of available times as quick replies
 */
function sendAvailableTimes(senderId, availableTimes) {
  const quickReplies = availableTimes.map((time) => ({
    content_type: 'text',
    title: time[bookingService.AVAILABILITY_DISPLAY_KEY],
    payload: time[bookingService.AVAILABILITY_DATA_KEY],
  }));
  const response = {
    text: 'Here are the available times. Please let us know what works best for you.',
    quick_replies: quickReplies,
  };
  callSendAPI(senderId, null, response);
}

/*
Ask for a phone number to confirm booking request
 */
function inquireForPhoneNumber(senderId) {
  const response = {
    text: 'Great! We just need a phone number to request this appointment.',
    quick_replies: [{
      content_type: 'user_phone_number', // Payload will be the user's phone number
    }],
  };
  callSendAPI(senderId, null, response);
}

/*
Acknowledge a booking request
 */
function acknowledgeBookingRequestReceived(senderId) {
  // TODO: Request one-time notif? https://developers.facebook.com/docs/messenger-platform/send-messages/one-time-notification
  const response = {
    text: 'Thank you so much! We will follow up shortly to confirm this booking.',
  };
  callSendAPI(senderId, null, response);
}

/*
Ask permission to follow up with a one time notification
 */
function askPermissionForFollowUp(senderId) {
  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'one_time_notif_req',
        title: 'Can we notify you with an appointment update?',
        payload: 'test',
      },
    },
  };
  callSendAPI(senderId, null, response);
}

module.exports = {
  sendMessage,
  sendInitialGreeting,
  sendAvailableTherapists,
  sendAvailableTimes,
  inquireForPhoneNumber,
  acknowledgeBookingRequestReceived,
  askPermissionForFollowUp,
};
