/*global describe*/
/*global test*/
/*global beforeAll*/
/*eslint-env node*/
const app = require('../app.js');
const request = require('supertest');
const helpers = require('./test-helpers.js');
const session = require('supertest-session');

describe('POST /login/', function() {
	var testSession = null;
	beforeAll(function () {
		testSession = session(app);
	});
	test('POST /login/ return 200', function(done) {
		request(app);
		testSession.post('/login/')
			.send({'username':'Screwee','password':'Password01'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Hello user Screwee')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});

describe('GET /profile/', function() {
	var cookie;

	beforeAll((done) => {
		helpers.loginUser((authenticatedSession) => {
			cookie = authenticatedSession;
			done();
		});
	});

	test('GET /profile/ returns users Information', function(done) {
		request(app);
		cookie.get('/profile/')
			.set('Accept', 'application/json')
			.expect(200, [{
				id: 1,
				username: 'Screwee'
			}])
			.expect('Content-Type',/json/)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('GET /logout/ logout user from session', function(done) {
		request(app);
		cookie.get('/logout/')
			.set('Accept', 'application/json')
			.expect(200, 'User logged out')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('GET /profile/ returns that user is not logged in', function(done) {
		request(app)
			.get('/profile/')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});


describe('User is not logged in', function() {
	test('GET /items', function(done) {
		request(app)
			.get('/items')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE /items/', function(done) {
		request(app)
			.delete('/items')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});
