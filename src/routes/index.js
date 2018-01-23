/*eslint-env node*/
const express = require('express');
const app = express();
require('../lib/setup-db.js');

app.use('/', require('./items.js'));
app.use('/', require('./profile.js'));
app.use('/', require('./authentications.js'));

module.exports = app;
