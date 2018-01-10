/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
const alasql = require('alasql');

alasql('CREATE TABLE users (userId INT PRIMARY KEY AUTOINCREMENT, username varchar(255), password varchar(255))');
alasql('CREATE TABLE items (itemId INT PRIMARY KEY AUTOINCREMENT,userId INT REFERENCES users(userId), name varchar(255), quantity int, unit varchar(25))');


alasql('INSERT INTO users VALUES (\'\',\'Screwee\',\'Password01\')');
alasql('INSERT INTO users VALUES (\'\',\'TanakhT\',\'Cookies58\')');
alasql('INSERT INTO users VALUES (\'\',\'VZV\',\'Password02\')');

var records = alasql('SELECT * FROM users');

exports.findById = function(id, cb) {
	process.nextTick(function() {
		var idx = id - 1;
		if (records[idx]) {
			cb(null, records[idx]);
		} else {
			cb(new Error('User ' + id + ' does not exist'));
		}
	});
};

exports.findByUsername = function(username, cb) {
	process.nextTick(function() {
		for (var i = 0, len = records.length; i < len; i++) {
			var record = records[i];
			if (record.username === username) {
				return cb(false, record);
			}
		}
		return cb(true, null);
	});
};
