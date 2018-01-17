/*global describe*/
/*global test*/
/*global beforeAll*/
/*global afterAll*/
/*eslint-env node*/
const app = require('../../src/app.js');
const request = require('supertest');
const helpers = require('../../src/lib/test-helpers.js');
const alasql = require('alasql');
var cookie;

beforeAll((done) => {
	helpers.loginUser((authenticatedSession) => {
		cookie = authenticatedSession;
		alasql('INSERT INTO items VALUES (\'\',\'1\',\'Cofee\',\'10\',\'ml\')');
		alasql('INSERT INTO items VALUES (\'\',\'1\',\'Bread\',\'1\',\'Kg\')');
		alasql('INSERT INTO items VALUES (\'\',\'2\',\'Lichi\',\'80\',\'Kg\')');
		done();
	});
});

describe('POST /items',() => {
	afterAll(() => {
		alasql('DELETE FROM items WHERE itemId > 3');
	});
	test('POST /items respond with json', (done) => {
		request(app)
			.post('/items/')
			.send({'userId':1,'name':'Cofee', 'quantity':10, 'unit':'ml'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.expect('{"userId":1,"name":"Cofee","quantity":10,"unit":"ml"}')
			.expect('Content-Type',/json/)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('POST /items respond with json second test with different data',(done) => {
		request(app)
			.post('/items/')
			.send({'userId':1,'name':'Bread', 'quantity':1, 'unit':'Kg'})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(201)
			.expect('{"userId":1,"name":"Bread","quantity":1,"unit":"Kg"}')
			.expect('Content-Type',/json/)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('quantity is NaN', (done) => {
		request(app)
			.post('/items/')
			.send({'name':'Cofee', 'quantity':'NaN', 'unit':'ml' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});


describe('GET /items', () => {
	test('GET respond with json', (done) => {
		request(app);
		cookie.get('/items/')
			.set('Accept', 'application/json')
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
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('GET /items/1 call item with id 1', (done) => {
		request(app);
		cookie.get('/items/1')
			.set('Accept', 'application/json')
			.expect(200, [{
				itemId: 1,
				userId: 1,
				name: 'Cofee',
				quantity: 10,
				unit: 'ml'
			}])
			.expect('Content-Type',/json/)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('GET item/4 returns 404 item not found', (done) => {
		request(app);
		cookie.get('/items/4')
			.set('Accept', 'application/json')
			.expect(404, 'item not found')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('GET item/NaN returns 400 Invalid input NaN is not a number!', (done) => {
		request(app);
		cookie.get('/items/NaN')
			.set('Accept', 'application/json')
			.expect(400, 'Invalid input NaN is not a number!')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/:itemId', () => {
	test('DELETE item/1 returns 204 and deltes item',(done) => {
		request(app);
		cookie.delete('/items/1')
			.set('Accept', 'application/json')
			.expect(204)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE item/4 returns 404 item not found',(done) => {
		request(app);
		cookie.delete('/items/4')
			.set('Accept', 'application/json')
			.expect(404, 'item not found')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE item/NaN returns 400 Invalid input NaN is not a number!',(done) => {
		request(app);
		cookie.delete('/items/NaN')
			.set('Accept', 'application/json')
			.expect(400, 'Invalid input NaN is not a number!')
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
	test('DELETE item/returns 204 and delte all item',(done) => {
		request(app);
		cookie.delete('/items')
			.set('Accept', 'application/json')
			.expect(204)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});
});
