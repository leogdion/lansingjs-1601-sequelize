var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  dialect : 'sqlite',
  storage : 'database.sqlite'
});

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

var UserFriend = User.belongsToMany(User, {as : "Friend", through: "UserFriend"});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/users', function (req, res) {
  User.findAll().then(function (users) {
    res.send(users);
  });
});

app.get('/users/:id', function (req, res) {
  User.findById(req.params.id,{ include: [ UserFriend ] }).then(function (user) {
    res.send(user);
  });
});

app.post('/users', function (req, res) {
  User.findAll({
    where : {
      'username' : {
        $in : req.body.friends
      }
    }
  }).then(function(friends) {
    var user = User.create({
      username: req.body.username,
      birthday: new Date(req.body.birthday),
    }).then(function (user) {
        user.setFriend(friends);
        res.send(user);
    });
  });

});

sequelize.sync().then(function() {
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
});
