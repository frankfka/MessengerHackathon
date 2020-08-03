// Inject env
require('dotenv').config()

// Verify token for Messenger to verify the webhook
const VERIFY_TOKEN = process.env.VERIFY_TOKEN
// Access token to call Messenger API
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

module.exports = {
  VERIFY_TOKEN,
  ACCESS_TOKEN
}