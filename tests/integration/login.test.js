/*global describe*/
/*global test*/
/*global beforeAll*/
/*eslint-env node*/
const app = require('../../src/app.js');
const request = require('supertest');
const helpers = require('../../src/lib/test-helpers.js');
const session = require('supertest-session');

describe('POST /login/', () => {
	var testSession = null;
	beforeAll(() => {
		testSession = session(app);
	});
	test('POST /login/ return 200',(done) => {
		request(app);
		testSession.post('/login/')
			.send({'username':'Screwee','password':'Password01'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Hello user Screwee')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});

describe('GET /profile/',() => {
	var cookie;

	beforeAll((done) => {
		helpers.loginUser((authenticatedSession) => {
			cookie = authenticatedSession;
			done();
		});
	});

	test('GET /profile/ returns users Information',(done) => {
		request(app);
		cookie.get('/profile/')
			.set('Accept', 'application/json')
			.expect(200, [{
				id: 1,
				username: 'Screwee'
			}])
			.expect('Content-Type',/json/)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('GET /logout/ logout user from session', (done) => {
		request(app);
		cookie.get('/logout/')
			.set('Accept', 'application/json')
			.expect(200, 'User logged out')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('GET /profile/ returns that user is not logged in', (done) => {
		request(app)
			.get('/profile/')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});

describe('User is not logged in',() => {
	test('GET /items', (done) => {
		request(app)
			.get('/items')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE /items/', (done) => {
		request(app)
			.delete('/items')
			.set('Accept', 'application/json')
			.expect(403, 'You are not logged in')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});
