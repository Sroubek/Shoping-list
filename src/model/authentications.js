/*eslint-env node*/
const user = require('./user.js');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'model-authentication'});

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser((id, done) => {
	user.findById(id, (err, user) => {
		done(err, user);
	});
});

passport.use(new JsonStrategy((username, password, cb) => {
	user.findByUsername(username, (err, user) => {
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

passport.loginUser = (req, res, next) => {
	passport.authenticate('json', (err, user) => {
		req.logIn(user, (err) => {
			if (err) {
				log.error(err);
				return res.status(403).send('Invalid username or password'); }
			log.info('Username: ' + user.username + ' logged');
			res.status(200).send('Hello user ' + user.username);
		});
	})(req, res, next);
};

passport.logoutUser = (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('User logged out');
	log.info('User logged out');
};

module.exports = passport;
