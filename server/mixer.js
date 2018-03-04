
var path = require('path');

const mixerRouter = require('express').Router();
const Address = require('./db/models/withdrawaladdress');
const DepositAddress = require('./db/models/depositAddress');

mixerRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//creates new withdrawal address in db
mixerRouter.post('/address', (req, res, next) => {
 return Address.create({
  parentAddress: req.body.parentAddress,
  address: req.body.address
 })
   .then(createdAddress => res.redirect('/'))
   .catch(next);

});

//gets withdrawaladdresses for a parent address
mixerRouter.get('/addresses/:address', (req, res, next) => {
  Address.findAll({attributes: ['address'],
  where: {
    parentAddress: req.params.address
  }
  })
   .then(addresses => res.send(addresses))
   .catch(next);

});

//creates a depositAddress for a user transfer
mixerRouter.post('/depositAddress', (req, res, next) => {
  return DepositAddress.create({
   parentAddress: req.body.parentAddress,
   depositAddress: req.body.depositAddress
  })
    .then(createdAddress => res.redirect('/'))
    .catch(next);

 });

 //gets all depositAddresses in db
 mixerRouter.get('/depositAddress', (req, res, next) => {
   DepositAddress.findAll({attributes: ['depositAddress']})
    .then(depositAddresses => res.send(depositAddresses))
    .catch(next);

 });

 //finds the source address that has a determined depositAddress.
 mixerRouter.get('/depositAddresses/:depositAddress', (req, res, next) => {
  DepositAddress.findOne({where: {
    depositAddress: req.params.depositAddress
  }
  })
   .then(depositAddress => res.send(depositAddress))
   .catch(next);
});

module.exports = mixerRouter;
