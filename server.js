var express = require('express');
var _ = require('underscore');
var http = require('http');
var app = express();
var server = require('http').createServer(app);
var accountController = require('./server/accountController');
var homeController = require('./server/homeController');
var pulse = require('./server/pulse');
var redis = require("redis");
var pomodoro = require("./server/pomodoro");

//setup a redis client based on if the environment is development or production
//var client = redis.createClient();

String.prototype.bool = function() {
  return (/^true$/i).test(this);
};

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));
app.use('/public', express.static('bower_components'));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: process.env.twilioAccountSid }));
app.use(app.router);

accountController.init(app);
homeController.init(app);
pulse.init(app);

server.listen(process.env.PORT || 3000);
setInterval(function() {
  pomodoro.tick();
}, 1000);
