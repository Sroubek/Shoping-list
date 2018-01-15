/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../config/middlewares.js');
require('../config/auth.js');
const passport = require('passport');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'authentication'});

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

// ----- Logout the User and end session -----
router.get('/logout', middlewares.loggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('User logged out');
	log.info('User logged out');
});

module.exports = router;
