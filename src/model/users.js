/*eslint-env node*/
const alasql = require('alasql');
const express = require('express');
const user = express();
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'model-user'});

user.findById = (id, cb) => {
	var records = alasql('SELECT * FROM users');
	process.nextTick(() => {
		var idx = id - 1;
		if (records[idx]) {
			cb(null, records[idx]);
		} else {
			cb(new Error('User ' + id + ' does not exist'));
		}
	});
};

user.findByUsername = (username, done) => {
	var records = alasql('SELECT * FROM users');
	process.nextTick(() => {
		for (var i = 0, len = records.length; i < len; i++) {
			var record = records[i];
			if (record.username === username) {
				return done(false, record);
			}
		}
		return done(true, null);
	});
};

user.getUserProfile = (userId) =>{
	const profile = alasql('SELECT id, username FROM users WHERE id= ?', userId);
	return profile;
};
module.exports = user;
