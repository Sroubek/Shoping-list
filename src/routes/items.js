/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const items = require('../model/items.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'routes-items'});

router.param('itemId', middlewares.itemId);

router.get('/items/', middlewares.loggedIn, (req, res, next) => {
	const item = items.getAllItems(req.user.id);
	res.send(item);
	log.info(item + 'Items found for user '+ req.user.username);
	next();
});

router.get('/items/:itemId', middlewares.loggedIn, (req, res, next) => {
	const item = items.getItemById(req.itemId, req.user.id);
	if (!item) {
		res.status(404).send('That item does not belong to you');
	} else {
		res.send(item);
		log.info([[item]] + 'Item found for user '+ req.user.username);
	}
	next();
});

router.post('/items/', (req, res, next) => {
	const newItem = items.postItem(req.body, res);
	if (!newItem){
		res.status(400).send('Invalid input');
	}
	res.status(201).send(newItem);
	log.info('Item added into database '+ newItem);
	next();
});

router.delete('/items/:itemId', middlewares.loggedIn, (req, res, next) => {
	const deleted = items.deleteItemById(req.itemId, req.user.id);
	if(deleted){
		log.info('Items deleted by user '+ req.user.username);
		res.status(204).send();
	} else {
		res.status(403).send('That item does not belong to you');
		log.info('Items deleted by user');
	}
	next();
});

router.delete('/items/', middlewares.loggedIn, (req, res, next) => {
	items.deleteAllItemsById(req.user.id);
	res.status(204).send();
	log.info('Items deleted by user');
	next();
});

module.exports = router;
