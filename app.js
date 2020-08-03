// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { initWelcomeScreen } = require('./service/messenger/common');
const { reqLogger, logger } = require('./service/logger');
const { webhookRouter } = require('./webhookEndpoint');

// Declare constants
port = 1337

// Create the app to listen on specified port
const app = express();
app.set('port', port);

// Body parser
app.use(bodyParser.json())
// Request Logging
app.use(reqLogger);

// Init webhook endpoint
app.use('/webhook', webhookRouter)
// Start app
app.listen(port, function() {
  logger.info(`Listening on Port ${port}`)
  // Create Messenger welcome screen
  initWelcomeScreen()
})