/*eslint-env node*/
const app = require('../app.js');
const session = require('supertest-session');
const alasql = require('alasql');
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
	}),
	setDb: (() => {
		alasql('INSERT INTO items VALUES (\'\',\'1\',\'Cofee\',\'10\',\'ml\')');
		alasql('INSERT INTO items VALUES (\'\',\'1\',\'Bread\',\'1\',\'Kg\')');
		alasql('INSERT INTO items VALUES (\'\',\'2\',\'Lichi\',\'80\',\'Kg\')');
	}),
	setUserDb: (() => {
		alasql('INSERT INTO users VALUES (\'\',\'Screwee\',\'Password01\')');
		alasql('INSERT INTO users VALUES (\'\',\'TanakhT\',\'Cookies58\')');
		alasql('INSERT INTO users VALUES (\'\',\'VZV\',\'Password02\')');
	})
};
