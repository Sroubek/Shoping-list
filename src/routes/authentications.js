/*eslint-env node*/
const express = require('express');
const router = express.Router();
const middlewares = require('../model/middlewares.js');
const passport = require('../model/authentications.js');

router.post('/login/', (req, res) => {
	passport.loginUser(req, res);
});

router.get('/logout', middlewares.loggedIn, (req, res) => {
	passport.logoutUser(req, res);
});

module.exports = router;
