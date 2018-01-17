/*eslint-env node*/
const app = require('../app.js');
const session = require('supertest-session');
var authenticatedSession;
let testSession = null;

module.exports = {

	loginUser: ((done) => {
		testSession = session(app);
		testSession.post('/login')
			.send({ username: 'Screwee', password: 'Password01' })
			.expect(200)
			.end(function (err) {
				if (err) {throw err;}
				authenticatedSession = testSession;
				done(authenticatedSession);
			});
	})
};
