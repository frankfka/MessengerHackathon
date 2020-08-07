/*
 Responsible for state CRUD. We would ideally use something like Redis, but using
 Node caching for demonstration purposes.

 Cache keys are always by the sender ID (PSID from FB Messenger)
 */
const NodeCache = require("node-cache");
const { logger } = require('../logger');
const conversationState = require('./conversationState');
const { getInitialState } = require('./conversationState');

// Create a cache for state
const stateCache = new NodeCache({
  // TODO: bump up TTL
  stdTTL: 60 // TTL to 1 hour for testing implementation
});

// Get a state from cache, or return an initial state if nothing is currently in cache
function getState(senderId) {
  let state = stateCache.get(senderId)
  if (!state) {
    // Return an initial state to start a new conversation
    state = getInitialState(senderId)
  }
  return state
}

// Save a state to cache with senderID as key
function saveState(state) {
  // Basic validation to make sure that the state is valid
  if (state[conversationState.STATE_CURR_STATE_KEY]
    && state[conversationState.STATE_SENDER_ID_KEY]) {
    logger.info("Saving state")
    logger.info(state)
    stateCache.set(state[conversationState.STATE_SENDER_ID_KEY], state)
  } else {
    logger.error("Attempting to save an invalid state")
    logger.error(state)
  }
}

// Delete a state from cache
function deleteSavedState(senderId) {
  stateCache.del(senderId)
}

module.exports = {
  getState,
  saveState,
  deleteSavedState
}