/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

const express = require('express');
const router = express.Router();
const alasql = require('alasql');
require('../item_db.js');
const db = require('../item_db.js');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;
const bodyParser = require('body-parser');

// logging, parsing, and session handling.
router.use(require('morgan')('combined'));
router.use(require('cookie-parser')());
//app.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

passport.use(new JsonStrategy(
	function(username, password, cb) {
		db.findByUsername(username, function(err, user) {
			if (err || !user) {
				return cb(true, null);
			}
			if (user.password != password) {
				return cb(true, null);
			}

			return cb(null, user);
		});
	}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	db.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	return res.status(403).send('You are not logged in');
	//return res.redirect('/login');
}

router.use(passport.initialize());
router.use(passport.session());


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

// Get all Users
router.get('/users/', (req, res, next) => {
	const users = alasql('SELECT * FROM users');
	res.send(users);
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

router.post('/login', function(req, res, next) {
	passport.authenticate('json', function(err, user) {
		if (err) {
			return res.status(403).send('Invalid username or password');
		}
		return res.status(200).send('Hello user ' + user.username);
	})(req, res, next);
});

router.get('/profile', isLoggedIn, function(req, res){
	return res.status(200).send(req.user.username);
});

module.exports = router;
