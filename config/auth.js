/*eslint-env node*/
const db = require('../item_db.js');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new JsonStrategy(
	function(username, password, cb) {
		db.findByUsername(username, function(err, user) {
			if (err) {
				return cb(err);
			}
			if (!user){
				return cb(null, false);
			}
			if (user.password != password) {
				return cb(true, null);
			}
			return cb(null, user);
		});
	}));

module.exports = passport;
