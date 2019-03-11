const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loggingMiddleware = require('./utils/loggingMiddleware');

const logger = require('./logger');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggingMiddleware(logger));

app.use('/', require('./controllers/patents'));

app.get('/healthz', (req, res) => res.send('Ok\n'));

module.exports = app;
