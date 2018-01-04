/*eslint no-undef: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*eslint-env node*/
const alasql = require('alasql');

module.exports = alasql('CREATE TABLE items (id int, name varchar(255), quantity int, unit varchar(25))');