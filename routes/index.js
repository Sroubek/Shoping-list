/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

const express = require('express');
const router = express.Router();

const alasql = require('alasql');
require('../item_db.js');

// Add your code here:
router.param('itemId', (req, res, next, id) => {
	const itemId = Number(id);
	if ( isNaN(itemId)){
		const NanId = id;
		return res.status(400).send('Invalid input ' + NanId + ' is not a number!');
	}
	const item = alasql('SELECT * FROM items WHERE itemId=?', itemId);
	const itemIndex = item.findIndex(item => item.itemId === itemId);
	if (itemIndex === -1) {
		return res.status(404).send('item not found');
	} else {
		req.itemId = itemId;
		next();
	}
});

// Get all Items
router.get('/items/', (req, res, next) => {
	const items = alasql('SELECT * FROM items');
	res.send(items);
	next();
});

// Get a single Item
router.get('/items/:itemId', (req, res, next) => {
	const item = alasql('SELECT * FROM items WHERE itemId= ?', req.itemId);
	res.send(item);
	next();
});

// Create a new item
router.post('/items/', (req, res, next) => {
	const newItem = req.body;
	if (isNaN(newItem.quantity) ){
		return res.status(400).send('Invalid input');
	}
	alasql('INSERT INTO items SELECT * FROM ?',[[newItem]]);
	res.status(201).send(newItem);
	next();
});

// Delete an Item
router.delete('/items/:itemId', (req, res, next) => {
	alasql('DELETE FROM items WHERE itemId=?', req.itemId);
	res.status(204).send();
	next();
});

// Delete all Items
router.delete('/items/', (req, res, next) => {
	alasql('DELETE FROM items');
	res.status(204).send();
	next();
});

module.exports = router;
