/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/

const express = require('express');
const authRouter = express.authRouter();
const alasql = require('alasql');
require('../item_db.js');
const db = require('../item_db.js');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;
const bodyParser = require('body-parser');

// logging, parsing, and session handling.
authRouter.use(require('morgan')('combined'));
authRouter.use(require('cookie-parser')());
//app.use(bodyParser.urlencoded({ extended: false }));
authRouter.use(bodyParser.json());
authRouter.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

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

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.post('/login', function(req, res, next) {
	passport.authenticate('json', function(err, user) {
		if (err) {
			return res.status(403).send('Invalid username or password');
		}
		return res.status(200).send('Hello user ' + user.username);
	})(req, res, next);
});

authRouter.get('/profile', isLoggedIn, function(req, res){
	return res.status(200).send(req.user.username);
});

module.exports = authRouter;
