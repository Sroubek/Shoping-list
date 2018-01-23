/*eslint-env node*/
const config = require('config');
const dbConfig = config.get('Item.dbConfig');
const app = require('./src/app.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'server'});

app.listen(dbConfig, () => {
	log.info('App is listening to the Port 4002');
});
