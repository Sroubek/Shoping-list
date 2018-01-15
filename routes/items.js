/*eslint-env node*/
const express = require('express');
const router = express.Router();
const alasql = require('alasql');
require('../item_db.js');
require('../config/auth.js');
const middlewares = require('../config/middlewares.js');
const bunyan = require('bunyan');

router.param('itemId', middlewares.itemId);
const log = bunyan.createLogger({name: 'items'});

// ----- Get all Items -----
router.get('/items/', middlewares.loggedIn, (req, res, next) => {
	const items = alasql('SELECT * FROM items WHERE userId=?', req.user.id);
	log.info(items);
	res.send(items);
	log.info(items + 'Items found for user '+ req.user.username);
	next();
});

// ----- Get a single Item -----
router.get('/items/:itemId', middlewares.loggedIn, (req, res, next) => {
	const userId = alasql('SELECT userId FROM items WHERE itemId='+ req.itemId);
	const id = userId[0];
	if (id.userId === req.user.id ){
		const item = alasql('SELECT * FROM items WHERE itemId='+ req.itemId + ' AND userId='+ req.user.id);
		res.send(item);
		log.info(item + 'Item found for user '+ req.user.username);
	} else{
		res.status(403).send('That item does not belong to you');
		log.info('Item doesnt belong to user '+ req.user.username);
	}
	next();
});

// ----- Create a new item -----
router.post('/items/', (req, res, next) => {
	const newItem = req.body;
	if (isNaN(newItem.quantity) ){
		return res.status(400).send('Invalid input');
	}
	alasql('INSERT INTO items SELECT * FROM ?',[[newItem]]);
	res.status(201).send(newItem);
	log.info('Item added into database '+ newItem);
	next();
});

// ----- Delete an Item -----
router.delete('/items/:itemId', middlewares.loggedIn, (req, res, next) => {
	const userId = alasql('SELECT userId FROM items WHERE itemId='+ req.itemId);
	const id = userId[0];
	if (id.userId === req.user.id ){
		alasql('DELETE FROM items WHERE itemId='+ req.itemId + ' AND userId='+ req.user.id);
		log.info('Items deleted by user '+ req.user.username);
		res.status(204).send();
	} else{
		res.status(403).send('That item does not belong to you');
		log.info('Items deleted by user');
	}
	next();
});

// ----- Delete all Items -----
router.delete('/items/', middlewares.loggedIn, (req, res, next) => {
	alasql('DELETE FROM items WHERE userId=?', req.user.id);
	res.status(204).send();
	log.info('Items deleted by user');
	next();
});

module.exports = router;
