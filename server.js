var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./server/db/models');
//var axios = require('axios');

var app = express();

app.use(morgan('      ↓ received :method :url · responded :status :res[Content-Type]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./server/mixer.js'));

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

db.db.sync() // if you update your db schemas, make sure you drop the tables first and then recreate them
.then(() => {
app.listen(3000, () => {
  console.log('app is running on 3000');
});
});

module.exports = app;

