/*eslint-env node*/
const express = require('express');
const items = express();
const alasql = require('alasql');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'model-items'});


items.getAllItems = (req, res, next) => {
	const items = alasql('SELECT * FROM items WHERE userId=?', req.user.id);
	log.info(items);
	res.send(items);
	log.info(items + 'Items found for user '+ req.user.username);
	next();
};

items.getItemById = (req, res, next) => {
	const userId = alasql('SELECT userId FROM items WHERE itemId='+ req.itemId);
	const id = userId[0];
	if (id.userId === req.user.id ){
		const item = alasql('SELECT * FROM items WHERE itemId='+ req.itemId + ' AND userId='+ req.user.id);
		res.send(item);
		log.info(item + 'Item found for user '+ req.user.username);
	} else{
		res.status(403).send('That item does not belong to you');
		log.info('Item doesnt belong to user '+ req.user.username);
	}	next();
};

items.postItem = (item, res, next) => {
	const newItem = item;
	if (isNaN(newItem.quantity) ){
		res.status(400).send('Invalid input');
	}
	alasql('INSERT INTO items SELECT * FROM ?',[[newItem]]);
	res.status(201).send(newItem);
	log.info('Item added into database '+ newItem);
	next();
};

items.deleteItemById = (req, res, next) => {
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
};

items.deleteAllItemsById = (req, res, next) => {
	alasql('DELETE FROM items WHERE userId=?', req.user.id);
	res.status(204).send();
	log.info('Items deleted by user');
	next();
};
module.exports = items;
