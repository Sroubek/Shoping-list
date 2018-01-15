/*eslint-env node*/
const express = require('express');
const router = express.Router();
const alasql = require('alasql');
const middlewares = require('../config/middlewares.js');
require('../item_db.js');
require('../config/auth.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'profile'});

// ----- Get profile of the User -----
router.get('/profile/', middlewares.loggedIn, (req, res) =>{
	res.status(200).send(alasql('SELECT id, username FROM users WHERE id= ?', req.user.id));
	log.info(alasql('SELECT id, username FROM users WHERE id= ?', req.user.id));
});

module.exports = router;
