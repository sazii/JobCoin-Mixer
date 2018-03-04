'use strict';

var db = require('../index');
var Sequelize = require('sequelize');

var WithdrawalAddress = db.define('withdrawalAddress', {

	parentAddress: {
		type: Sequelize.STRING, allowNull: false, notEmpty: true
	},

	address: {
		type: Sequelize.STRING, allowNull: false, notEmpty: true
	}
});

module.exports = WithdrawalAddress;
