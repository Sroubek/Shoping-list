/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const user = require('../model/user.js');

router.get('/profile/', middlewares.loggedIn, (req, res) => {
	user.getUserProfile(req, res);
});

module.exports = router;
