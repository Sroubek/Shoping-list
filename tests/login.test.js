/*global describe*/
/*global test*/
/*eslint-env node*/
const app = require('../app.js');
const request = require('supertest');
var cookie;

describe('POST /login/', function() {
	test('POST /login/ respond with json', function(done) {
		request(app)
			.post('/login/')
			.send({'username':'Screwee','password':'Password01'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Hello user Screwee')
			.end(function(err,res) {
				if (err) return done(err);
				cookie = res.headers['set-cookie'];
				done();
			});
	});
});

describe('GET /profile/', function() {
	test('GET /profile/ returns users Information', function(done) {
		request(app)
			.get('/profile/')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
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
});
describe('GET /logout/', function() {
	test('GET /logout/ logout user from session', function(done) {
		request(app)
			.get('/logout/')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
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
			.set('cookie', cookie)
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
