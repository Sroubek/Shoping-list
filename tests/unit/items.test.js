/* eslint-env jest */

const items = require('../../src/model/items.js');
const helpers = require('../../src/lib/test-helpers.js');
const alasql = require('alasql');

beforeAll((done) => {
	helpers.setDb();
	done();
});

describe('getItemById', () => {
	const expectedItem = [{itemId: 1, userId: 1, name: 'Cofee',quantity: 10, unit: 'ml'}];
	test('Should show item from database for user', () => {
		expect(items.getItemById(1,1)).toEqual(expectedItem);
	});
	test('UserId for item is different, should return null item', () => {
		expect(items.getItemById(1,2)).toEqual(null);
	});
});

describe('getAllItems', () => {
	const expectedItems = [{itemId: 1, userId: 1, name: 'Cofee',quantity: 10, unit: 'ml'},
		{itemId: 2, userId: 1, name: 'Bread',quantity: 1, unit: 'Kg'}];
	test('Should return items from database for user', () => {
		expect(items.getAllItems(1)).toEqual(expectedItems);
	});
	test('Should return empty array', () => {
		expect(items.getAllItems(10)).toEqual([]);
	});
});

describe('postItem', () => {
	afterAll(() => {
		alasql('DELETE FROM items WHERE itemId > 3');
	});
	const item = {'userId':1,'name':'Cofee', 'quantity':10, 'unit':'ml'};
	const itemNaN = {'userId':1,'name':'Cofee', 'quantity':NaN, 'unit':'ml'};
	const expectedNewItem = {userId: 1, name: 'Cofee',quantity: 10, unit: 'ml'};
	test('Should return items from database for user', () => {
		expect(items.postItem(item)).toEqual(expectedNewItem);
	});
	test('Should return items from database for user', () => {
		expect(items.postItem(itemNaN)).toEqual(null);
	});
});

describe('deleteItemById', () => {
	test('Should return True', () => {
		expect(items.deleteItemById(3,2)).toEqual(true);
	});
	test('Should return False', () => {
		expect(items.deleteItemById(1,3)).toEqual(false);
	});
});
