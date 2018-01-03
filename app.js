/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
const express = require('express');
const app = express();

const config = require('config');
const dbConfig = config.get('Item.dbConfig');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use('/', require('./routes/'));

app.listen(dbConfig, () => {
	// Port listen to Port 4002
});

module.exports = app;
