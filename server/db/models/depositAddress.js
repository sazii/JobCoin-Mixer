'use strict';

var db = require('../index');
var Sequelize = require('sequelize');

var DepositAddress = db.define('depositAddress', {

	parentAddress: {
		type: Sequelize.STRING, allowNull: false, notEmpty: true
	},

	depositAddress: {
		type: Sequelize.STRING, allowNull: false, notEmpty: true
	}
});

module.exports = DepositAddress;
