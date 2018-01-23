/*eslint-env node*/
const express = require('express');
const items = express();
const alasql = require('alasql');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'model-items'});


items.getAllItems = (userId) => {
	const items = alasql('SELECT * FROM items WHERE userId=?', userId);
	log.info(items);
	return items;
};

items.getItemById = (itemId, valUserId) => {
	const userId = alasql('SELECT userId FROM items WHERE itemId='+ itemId);
	const id = userId[0];
	let item = null;
	if (id.userId === valUserId ){
		item = alasql('SELECT * FROM items WHERE itemId='+ itemId + ' AND userId='+ valUserId);
		return item;
	} else{
		return item;
	}
};

items.postItem = (item) => {
	let newItem = item;
	if (isNaN(newItem.quantity) ){
		let newItem = null;
		return newItem;
	}
	alasql('INSERT INTO items SELECT * FROM ?',[[newItem]]);
	log.info('Item added into database '+ newItem);
	return newItem;
};

items.deleteItemById = (itemId, valUserId) => {
	const userId = alasql('SELECT userId FROM items WHERE itemId='+ itemId);
	const id = userId[0];
	let deleted = false;
	if (id.userId === valUserId){
		alasql('DELETE FROM items WHERE itemId='+ itemId + ' AND userId='+ userId);
		deleted = true;
		return deleted;
	} return deleted;
};

items.deleteAllItemsById = (userId) => {
	alasql('DELETE FROM items WHERE userId=?', userId);
};
module.exports = items;
