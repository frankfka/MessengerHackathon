/*
Defines a set of states that are valid for the chatbot
*/
const { logger } = require('../logger');

// States
const STATE_INIT = "INIT" // Start
const STATE_HUMAN_NEEDED = "HUMAN_NEEDED" // Terminal
const STATE_INITIAL_OPTIONS_SENT = "INITIAL_OPTIONS_SENT"
const STATE_BOOK_REQUESTED = "BOOK_REQUESTED"
const STATE_BOOK_THERAPIST_PICKED = "BOOK_THERAPIST_PICKED"
const STATE_BOOK_TIME_PICKED = "BOOK_TIME_PICKED"
const STATE_PHONE_CONFIRMED = "PHONE_CONFIRMED"

// State object keys
const STATE_SENDER_ID_KEY = "sender_id"
const STATE_CURR_STATE_KEY = "current_state"
const STATE_PICKED_THERAPIST_ID_KEY = "requested_therapist_id"
const STATE_PICKED_TIME_ID_KEY = "picked_time_id"
const STATE_PHONE_NUMBER_KEY = "phone_number"

// Actions
const ACTION_SPEAK_TO_HUMAN = "SPEAK_TO_HUMAN" // Catch all for invalid states to direct to a human
const ACTION_SEND_INITIAL_OPTIONS = "SEND_INITIAL_OPTIONS"
const ACTION_BOOK_APPT = "BOOK_APPT"
const ACTION_PICK_THERAPIST = "PICK_THERAPIST"
const ACTION_PICK_TIME = "PICK_TIME"
const ACTION_GIVE_PN = "GIVE_PN"

// Action object keys and factory functions
const ACTION_CODE_KEY = "action_code"
function getBaseAction(code) {
  let actionObject = {}
  actionObject[ACTION_CODE_KEY] = code
  return actionObject
}
function getSendInitialOptionsAction() {
  return getBaseAction(ACTION_SEND_INITIAL_OPTIONS)
}
function getSpeakToHumanAction() {
  return getBaseAction(ACTION_SPEAK_TO_HUMAN)
}
function getBookAppointmentAction() {
  return getBaseAction(ACTION_BOOK_APPT)
}
function getPickTherapistAction(therapistId) {
  let actionObject = getBaseAction(ACTION_PICK_THERAPIST)
  actionObject[STATE_PICKED_THERAPIST_ID_KEY] = therapistId
  return actionObject
}
function getPickTimeAction(timeId) {
  let actionObject = getBaseAction(ACTION_PICK_TIME)
  actionObject[STATE_PICKED_TIME_ID_KEY] = timeId
  return actionObject
}
function getGivePhoneNumberAction(phoneNumber) {
  let actionObject = getBaseAction(ACTION_GIVE_PN)
  actionObject[STATE_PHONE_NUMBER_KEY] = phoneNumber
  return actionObject
}

// Create an initial state
function getInitialState(senderId) {
  let state = {}
  state[STATE_SENDER_ID_KEY] = senderId
  state[STATE_CURR_STATE_KEY] = STATE_INIT
  return state
}

// Get a new state object from current state and action
function getNewState(currentState, action) {
  let newState = { ...currentState } // State shouldn't have nested properties
  let currentStateCode = currentState[STATE_CURR_STATE_KEY]
  let actionCode = action[ACTION_CODE_KEY]

  // Default to human needed
  let newStateCode = STATE_HUMAN_NEEDED
  // State logic for happy path
  switch (currentStateCode) {
    case STATE_INIT:
      // Can book appointment on initial state
      if (actionCode === ACTION_SEND_INITIAL_OPTIONS) {
        newStateCode = STATE_INITIAL_OPTIONS_SENT
      }
      break
    case STATE_INITIAL_OPTIONS_SENT:
      // Can book appointment after options sent
      if (actionCode === ACTION_BOOK_APPT) {
        newStateCode = STATE_BOOK_REQUESTED
      }
      break
    case STATE_BOOK_REQUESTED:
      // Can pick a therapist
      if (actionCode === ACTION_PICK_THERAPIST) {
        newStateCode = STATE_BOOK_THERAPIST_PICKED
        // Add therapist name
        newState[STATE_PICKED_THERAPIST_ID_KEY] = action[STATE_PICKED_THERAPIST_ID_KEY]
      }
      break
    case STATE_BOOK_THERAPIST_PICKED:
      // Can pick an available time
      if (actionCode === ACTION_PICK_TIME) {
        newStateCode = STATE_BOOK_TIME_PICKED
        // Add picked time
        newState[STATE_PICKED_TIME_ID_KEY] = action[STATE_PICKED_TIME_ID_KEY]
      }
      break
    case STATE_BOOK_TIME_PICKED:
      // Can provide a phone number
      if (actionCode === ACTION_GIVE_PN) {
        newStateCode = STATE_PHONE_CONFIRMED
        // Add phone number
        newState[STATE_PHONE_NUMBER_KEY] = action[STATE_PHONE_NUMBER_KEY]
      }
      break
    case STATE_PHONE_CONFIRMED:
      // TODO: no future actions yet
      break
  }

  logger.info(
    `Dispatching ${actionCode} for current
     state ${currentStateCode} gives ${newStateCode}`
  )
  newState[STATE_CURR_STATE_KEY] = newStateCode

  return newState
}

module.exports = {
  // State codes
  STATE_INIT,
  STATE_INITIAL_OPTIONS_SENT,
  STATE_BOOK_REQUESTED,
  STATE_BOOK_THERAPIST_PICKED,
  STATE_BOOK_TIME_PICKED,
  STATE_PHONE_CONFIRMED,

  // State Keys
  STATE_SENDER_ID_KEY,
  STATE_CURR_STATE_KEY,
  STATE_PICKED_THERAPIST_ID_KEY,

  // State functions
  getInitialState,
  getNewState,

  // Action factory functions
  getSendInitialOptionsAction,
  getBookAppointmentAction,
  getPickTherapistAction,
  getPickTimeAction,
  getGivePhoneNumberAction,
  getSpeakToHumanAction
}