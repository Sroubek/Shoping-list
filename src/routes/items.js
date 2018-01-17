/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const items = require('../model/items.js');

router.param('itemId', middlewares.itemId);

router.get('/items/', middlewares.loggedIn, (req, res) => {
	items.getAllItems(req, res);
});

router.get('/items/:itemId', middlewares.loggedIn, (req, res) => {
	items.getItemById(req, res);
});

router.post('/items/', (req, res) => {
	items.postItem(req.body, res);
});

router.delete('/items/:itemId', middlewares.loggedIn, (req, res) => {
	items.deleteItemById(req, res);
});

router.delete('/items/', middlewares.loggedIn, (req, res) => {
	items.deleteAllItemsById(req, res);
});

module.exports = router;
