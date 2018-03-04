'use strict';
const WithdrawalAddress = require('./withdrawalAddress');
const DepositAddress = require('./depositAddress');
var db = require('../index');

module.exports = {
  WithdrawalAddress,
  DepositAddress,
	db
};
