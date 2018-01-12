/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

// ------ set up ------
const express = require('express');
const app = express();
const config = require('config');
const dbConfig = config.get('Item.dbConfig');
const bodyParser = require('body-parser');
// ----- configuration -----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// ----- routes -----
app.use('/', require('./routes/'));

// ----- launch -----
app.listen(dbConfig);

// ----- Exporting -----
module.exports = app;
