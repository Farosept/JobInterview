var mysql = require('mysql');
var config = require('./config');
var connection = mysql.createPool(config.get('db'));
module.exports = connection;