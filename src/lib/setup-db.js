/*eslint-env node*/
const alasql = require('alasql');

alasql('CREATE TABLE users (id INT PRIMARY KEY AUTOINCREMENT, username varchar(255), password varchar(255))');
alasql('CREATE TABLE items (itemId INT PRIMARY KEY AUTOINCREMENT,userId INT REFERENCES users(Id), name varchar(255), quantity int, unit varchar(25))');

alasql('INSERT INTO users VALUES (\'\',\'Screwee\',\'Password01\')');
alasql('INSERT INTO users VALUES (\'\',\'TanakhT\',\'Cookies58\')');
alasql('INSERT INTO users VALUES (\'\',\'VZV\',\'Password02\')');
