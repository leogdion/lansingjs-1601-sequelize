var express = require('express');
var app = express();

var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  dialect : 'sqlite',
  storage : 'database.sqlite'
});

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/users', function (req, res) {
  User.findAll().then(function (users) {
    res.send(users);
  });
});


sequelize.sync().then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  });
}).then(function(jane) {
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
});
