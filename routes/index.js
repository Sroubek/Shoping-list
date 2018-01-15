/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
// ------ set up ------
const express = require('express');
const router = express.Router();
const alasql = require('alasql');
require('../item_db.js');
require('../config/auth.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const bunyan = require('bunyan');
// ----- configuration -----
router.use(require('morgan')('combined'));
router.use(bodyParser.json());
router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
const log = bunyan.createLogger({name: 'router'});

// ----- funcion for checking  -----
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	log.info('You are not logged in');
	return res.status(403).send('You are not logged in');
}

// ----- middleware -----
router.param('itemId',(req, res, next, id) => {
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
});

//===============================================
//====           Item routes                 ====
//===============================================

// ----- Get all Items -----
router.get('/items/', isLoggedIn, (req, res, next) => {
	const items = alasql('SELECT * FROM items WHERE userId=?', req.user.id);
	log.info(items);
	res.send(items);
	log.info(items + 'Items found for user '+ req.user.username);
	next();
});

// Get a single Item
router.get('/items/:itemId', isLoggedIn, (req, res, next) => {
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
router.delete('/items/:itemId', isLoggedIn, (req, res, next) => {
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
router.delete('/items/', isLoggedIn, (req, res, next) => {
	alasql('DELETE FROM items WHERE userId=?', req.user.id);
	res.status(204).send();
	log.info('Items deleted by user');
	next();
});

//===============================================
//====           User routes                 ====
//===============================================
// ----- Login an User and start session -----
router.post('/login/', (req, res, next) => {
	passport.authenticate('json', (err, user) => {
		req.logIn(user, (err) => {
			if (err) {
				log.error(err);
				return res.status(403).send('Invalid username or password'); }
			log.info('Username: ' + user.username + ' logged');
			res.status(200).send('Hello user ' + user.username);
		});
	})(req, res, next);
});

// ----- Get profile of the User -----
router.get('/profile/', isLoggedIn, (req, res) =>{
	res.status(200).send(alasql('SELECT id, username FROM users WHERE id= ?', req.user.id));
	log.info(alasql('SELECT id, username FROM users WHERE id= ?', req.user.id));
});

// ----- Logout the User and end session -----
router.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('User logged out');
	log.info('User logged out');
});

module.exports = router;
