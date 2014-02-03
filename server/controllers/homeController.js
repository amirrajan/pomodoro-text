var authorized = require('./accountController').authorized;
var isAuthorized = require('./accountController').isAuthorized;
var pomodoro = require('../models/pomodoro');
var textMessage = require('../models/textMessage');
var env = process.env;

function init(app) {
  app.get('/', authorized, function (req, res) {
    res.render('index');
  });

  app.get('/current', authorized, function(req, res) {
    res.json(pomodoro.currentTask());
  });

  app.get('/break', authorized, function(req, res) {
    res.json(pomodoro.currentBreak());
  });

  app.post('/text', function(req, res) {
    var message = req.body.Body;
    var fromNumber = req.body.From;
    var result = { };

    if(!isAuthorized(req)) {
      if(fromNumber != env.mobile) {
        result.message = 'number [' + fromNumber + '] not allowed.';
        textMessage.send('unauthorized access from: [' + fromNumber + ']'); 
        res.json(result);
        return;
      }
    }

    if(message.match(/^\s*status\s*$/i)) {
      if(pomodoro.isWorkingOnTask()) {
        var currentTask = pomodoro.currentTask();
        result.message = currentTask.title + " - " + currentTask.minutesLeft.toFixed(2) + " minute(s) left.";
        textMessage.send(message);
      } else if(pomodoro.isOnBreak()) {
        var currentTask = pomodoro.currentBreak();
        result.message = "yay! you're on a break - " + currentTask.minutesLeft.toFixed(2) + " minute(s) left."
        textMessage.send(result.message);
      } else {
        result.message = "no pomodoro is currently running, reply to me to start one, or be lazy and do nothing";
        textMessage.send(result.message);
      }
    } else if (message.match(/^\s*break\s*$/i)) {
      pomodoro.startBreak();
      result.message = "break started";
    } else if (message.match(/^\s*clear\s*$/i)) {
      pomodoro.clearAll();
      result.message = "cleared";
    } else if (message.match(/^\s*$/i)) {
      pomodoro.clearAll();
      result.message = "cleared";
    } else {
      pomodoro.startTask(message);
      result.message = message + ' started at ' + new Date();
    }

    res.json(result);
  });
}

module.exports.init = init;
