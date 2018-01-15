/*eslint-env node*/
const alasql = require('alasql');
require('../item_db.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'middlewares'});

module.exports = {

	itemId: ((req, res, next, id) => {
		const itemId = Number(id);
		if ( isNaN(itemId)){
			const NanId = id;
			res.status(400).send('Invalid input ' + NanId + ' is not a number!');
			log.info('Invalid input ' + NanId + ' is not a number!');
		}
		const item = alasql('SELECT * FROM items WHERE itemId=?', itemId);
		const itemIndex = item.findIndex(item => item.itemId === itemId);
		if (itemIndex === -1) {
			res.status(404).send('item not found');
			log.info('item not found');
		} else {
			log.info(itemId + 'found');
			req.itemId = itemId;
			next();
		}
	}),
	loggedIn: function (req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		log.info('You are not logged in');
		return res.status(403).send('You are not logged in');
	}


};

//module.exports = router;
