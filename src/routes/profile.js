/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const user = require('../model/users.js');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'route-profile'});

router.get('/profile/', middlewares.loggedIn, (req, res, next) => {
	const profile = user.getUserProfile(req.user.id);
	log.info(profile);
	res.status(200).send(profile);
	next();
});

module.exports = router;
