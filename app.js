/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const alasql = require('alasql');


app.use(express.static('public'));

const PORT = process.env.PORT || 4002;

alasql('CREATE TABLE items (id int, name varchar(255), quantity int, unit varchar(25))');

alasql('INSERT INTO items VALUES (\'1\',\'Bread\',\'1\',\'Kg\')');
alasql('INSERT INTO items VALUES (\'2\',\'Rice\',\'2\',\'Kg\')');
alasql('INSERT INTO items VALUES (\'3\',\'Pudding\',\'2\',\'Kg\')');

// Body-parsing Middleware
app.use(bodyParser.json());

// Get all Items
app.get('/items/', (req, res, next) => {
	const items = alasql('SELECT * FROM items');
	res.send(items);
	next();
});

// Get a single Item
app.get('/items/:itemId', (req, res, next) => {
	const itemId = Number(req.params.itemId);
	const item = alasql('SELECT * FROM items WHERE id='+ itemId);
	const itemIndex = item.findIndex(item => item.id === itemId);
	if (itemIndex === -1) {
		return res.status(404).send('item not found');
	}
	res.send(item);
	next();
});


// Create a new item
app.post('/items/', (req, res, next) => {
	const newitem = req.body;
	alasql('SELECT * INTO items FROM ?',[[newitem]]);
	res.status(201).send(newitem);
	next();
});

// Delete am Item
app.delete('/items/:itemId', (req, res, next) => {
	const itemId = Number(req.params.itemId);
	const item = alasql('SELECT * FROM items WHERE id='+ itemId);
	alasql('DELETE FROM items WHERE id='+ itemId);
	const itemIndex = item.findIndex(item => item.id === itemId);
	if (itemIndex === -1) {
		return res.status(404).send('item not found');
	}

	res.status(204).send();
	next();
});

// Delete all Items
app.delete('/items/', (req, res, next) => {
	alasql('DELETE FROM items');
	res.status(204).send();
	next();
});


app.listen(PORT, () => {
	// Port listen to Port 4001
});
module.exports = app;
