/*global describe*/
/*global test*/
/*eslint-env node*/
const app = require('../app.js');
const request = require('supertest');
var cookie;

describe('POST /items', function() {
	test('POST /items respond with json', function(done) {
		request(app)
			.post('/items/')
			.send({'userId':1,'name':'Cofee', 'quantity':10, 'unit':'ml'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.expect('{"userId":1,"name":"Cofee","quantity":10,"unit":"ml"}')
			.expect('Content-Type',/json/)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('POST /items respond with json second test with different data', function(done) {
		request(app)
			.post('/items/')
			.send({'userId':1,'name':'Bread', 'quantity':1, 'unit':'Kg'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.expect('{"userId":1,"name":"Bread","quantity":1,"unit":"Kg"}')
			.expect('Content-Type',/json/)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('quantity is NaN', function(done) {
		request(app)
			.post('/items/')
			.send({'name':'Cofee', 'quantity':'NaN', 'unit':'ml' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(400)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});


describe('GET /items', function() {
	request(app)
		.post('/login/')
		.send({'username':'Screwee','password':'Password01'})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.end(function(err,res) {
			cookie = res.headers['set-cookie'];
		});
	test('GET respond with json', function(done) {
		request(app)
			.get('/items/')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(200, [{
				itemId: 1,
				userId: 1,
				name: 'Cofee',
				quantity: 10,
				unit: 'ml'
			},{
				itemId: 2,
				userId: 1,
				name: 'Bread',
				quantity: 1,
				unit: 'Kg'
			}])
			.expect('Content-Type',/json/)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});

describe('GET /items/itemId', function() {
	request(app)
		.post('/login/')
		.send({'username':'Screwee','password':'Password01'})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.end(function(err,res) {
			cookie = res.headers['set-cookie'];
		});
	test('GET /items/1 call item with id 1', function(done) {
		request(app)
			.get('/items/1')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(200, [{
				itemId: 1,
				userId: 1,
				name: 'Cofee',
				quantity: 10,
				unit: 'ml'
			}])
			.expect('Content-Type',/json/)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('GET item/4 returns 404 item not found', function(done) {
		request(app)
			.get('/items/4')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(404, 'item not found')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('GET item/NaN returns 400 Invalid input NaN is not a number!', function(done) {
		request(app)
			.get('/items/NaN')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(400, 'Invalid input NaN is not a number!')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/:itemId', function() {
	request(app)
		.post('/login/')
		.send({'username':'Screwee','password':'Password01'})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.end(function(err,res) {
			cookie = res.headers['set-cookie'];
		});
	test('DELETE item/1 returns 204 and deltes item', function(done) {
		request(app)
			.delete('/items/1')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(204)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE item/4 returns 404 item not found', function(done) {
		request(app)
			.delete('/items/4')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(404, 'item not found')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE item/NaN returns 400 Invalid input NaN is not a number!', function(done) {
		request(app)
			.delete('/items/NaN')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(400, 'Invalid input NaN is not a number!')
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/', function() {
	request(app)
		.post('/login/')
		.send({'username':'Screwee','password':'Password01'})
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.end(function(err,res) {
			cookie = res.headers['set-cookie'];
		});
	test('DELETE item/returns 204 and delte all item', function(done) {
		request(app)
			.delete('/items')
			.set('Accept', 'application/json')
			.set('cookie', cookie)
			.expect(204)
			.end(function(err) {
				if (err) return done(err);
				done();
			});
	});
});