/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const passport = require('../model/authentications.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'router-authentication'});
router.post('/login/', (req, res) => {
	passport.loginUser(req, res);
});

router.get('/logout', middlewares.loggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('User logged out');
	log.info('User logged out');
});

module.exports = router;
