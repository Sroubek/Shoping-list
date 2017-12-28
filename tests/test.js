/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
const request = require('supertest');
const express = require('express');
const app =  require('../app.js');

describe('POST /items', function() {
	test('respond with json', function(done) {
		request(app)
			.post('/items/')
			.field({ 'id':'4', 'name':'Cofee', 'quantity':10, 'unit':'ml' })
			.set('Accept', 'application/json')
			.expect(201)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});

describe('GET /items', function() {
	test('GET respond with json', function(done) {
		request(app)
			.get('/items/')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});

describe('GET /items/1', function() {
	test('GET /items/1 call item with id 1', function(done) {
		request(app)
			.get('/items/1')
			.set('Accept', 'application/json')
			.expect(200, [{
				id: 1,
				name: 'Bread',
				quantity: 1,
				unit: 'Kg'
			}], done);
	});
});

describe('GET /items/4', function() {
	test('GET item/4 returns 404 item not found', function(done) {
		request(app)
			.get('/items/4')
			.set('Accept', 'application/json')
			.expect(404, 'item not found')
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/1', function() {
	test('DELETE item/1 returns 204 and deltes item', function(done) {
		request(app)
			.delete('/items/1')
			.set('Accept', 'application/json')
			.expect(204)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/4', function() {
	test('DELETE item/4 returns 404 item not found', function(done) {
		request(app)
			.delete('/items/4')
			.set('Accept', 'application/json')
			.expect(404, 'item not found')
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});

describe('DELETE /items/', function() {
	test('DELETE item/returns 204 and delte all item', function(done) {
    request(app)
			.delete('/items')
			.set('Accept', 'application/json')
			.expect(204)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	});
});
