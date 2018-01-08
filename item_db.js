/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
const alasql = require('alasql');

module.exports = alasql('CREATE TABLE users (userId INT PRIMARY KEY AUTOINCREMENT, username varchar(255), password varchar(255))');

module.exports = alasql('CREATE TABLE items (itemId INT PRIMARY KEY AUTOINCREMENT,userId INT REFERENCES users(userId), name varchar(255), quantity int, unit varchar(25))');


alasql('INSERT INTO users VALUES (\'\',\'Screwee\',\'Password01\')');
alasql('INSERT INTO users VALUES (\'\',\'TanakhT\',\'Cookies58\')');
alasql('INSERT INTO users VALUES (\'\',\'VZV\',\'Password02\')');
