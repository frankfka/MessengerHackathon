const { handlePostback } = require('./service/messenger/postbackHandlers');
const { handleMessage } = require('./service/messenger/messageHandlers');
const { Router } = require('express');
const secrets = require('./secrets')


// Handles a webhook event
function handleWebhookPost(req, res) {
  let body = req.body;
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Get event itself
      let webhookEvent = entry.messaging[0]; // Entry will only contain one item
      // Get the sender PSID
      let senderId = webhookEvent.sender.id;

      if (webhookEvent.message) {
        handleMessage(senderId, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handlePostback(senderId, webhookEvent.postback);
      }
    });
    // Return 200 immediately
    res.sendStatus(200)
  } else {
    // Invalid request
    res.sendStatus(404);
  }
}

// Handle Facebook webhook verification
function handleWebhookGet(req, res) {
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === secrets.VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

// Create Router
const webhookRouter = Router();
webhookRouter.post('/', handleWebhookPost)
webhookRouter.get('/', handleWebhookGet)

// Export
module.exports = { webhookRouter }