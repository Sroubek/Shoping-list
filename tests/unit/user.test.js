/* eslint-env jest */
const users = require('../../src/model/users.js');
const helpers = require('../../src/lib/test-helpers.js');

beforeAll((done) => {
	helpers.setUserDb();
	done();
});

describe('getUserProfile', () => {
	const profile = [{id: 1, username: 'Screwee' }];
	test('Should return user profile', () => {
		expect(users.getUserProfile(1)).toEqual(profile);
	});
	test('Should return error msg', () => {
		expect(users.getUserProfile(100)).toEqual([]);
	});
});
