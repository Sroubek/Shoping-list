/*eslint-env node*/
const alasql = require('alasql');

alasql('CREATE TABLE users (id INT PRIMARY KEY AUTOINCREMENT, username varchar(255), password varchar(255))');
alasql('CREATE TABLE items (itemId INT PRIMARY KEY AUTOINCREMENT,userId INT REFERENCES users(Id), name varchar(255), quantity int, unit varchar(25))');

alasql('INSERT INTO users VALUES (\'\',\'Screwee\',\'Password01\')');
alasql('INSERT INTO users VALUES (\'\',\'TanakhT\',\'Cookies58\')');
alasql('INSERT INTO users VALUES (\'\',\'VZV\',\'Password02\')');
/*
alasql('INSERT INTO items VALUES (\'\',\'1\',\'Cofee\',\'10\',\'ml\')');
alasql('INSERT INTO items VALUES (\'\',\'1\',\'Bread\',\'1\',\'Kg\')');
alasql('INSERT INTO items VALUES (\'\',\'2\',\'Lichi\',\'80\',\'Kg\')');
*/
