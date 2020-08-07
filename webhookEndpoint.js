const { Router } = require('express');
const secrets = require('./secrets');
const { handleMessengerEvent } = require('./service/messenger/mainHandler');

// Handles a webhook event
function handleWebhookPost(req, res) {
  const { body } = req;
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach((entry) => {
      // Get event itself
      const webhookEvent = entry.messaging[0]; // Entry will only contain one item
      if (webhookEvent) {
        handleMessengerEvent(webhookEvent);
      }
    });
    // Return 200 immediately
    res.sendStatus(200);
  } else {
    // Invalid request
    res.sendStatus(404);
  }
}

// Handle Facebook webhook verification
function handleWebhookGet(req, res) {
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

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
webhookRouter.post('/', handleWebhookPost);
webhookRouter.get('/', handleWebhookGet);

// Export
module.exports = { webhookRouter };
