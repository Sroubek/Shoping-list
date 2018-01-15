/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

// ------ set up ------
const express = require('express');
const app = express();
const config = require('config');
const dbConfig = config.get('Item.dbConfig');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
// ----- configuration -----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
const log = bunyan.createLogger({name: 'app'});
// ----- routes -----
app.use('/', require('./routes/'));

// ----- launch -----
app.listen(dbConfig, () => {
	log.info('App is listening to the Port 4002');
});

// ----- Exporting -----
module.exports = app;
