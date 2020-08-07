// Inject env
require('dotenv').config();

// Verify token for Messenger to verify the webhook
const { VERIFY_TOKEN } = process.env;
// Access token to call Messenger API
const { ACCESS_TOKEN } = process.env;

module.exports = {
  VERIFY_TOKEN,
  ACCESS_TOKEN,
};
