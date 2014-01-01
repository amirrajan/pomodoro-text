var authorized = require('./accountController').authorized;
var pomodoro = require('../models/pomodoro');
var textMessage = require('../models/textMessage');

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

    if(message.match(/^\s*status\s*$/i)) {
      if(pomodoro.isWorkingOnTask()) {
        var currentTask = pomodoro.currentTask();
        textMessage.send(currentTask.title + " - " + currentTask.minutesLeft.toFixed(2) + " minute(s) left.");
      } else if(pomodoro.isOnBreak()) {
        var currentTask = pomodoro.currentBreak();
        textMessage.send("yay! you're on a break - " + currentTask.minutesLeft.toFixed(2) + " minute(s) left.");
      } else {
        textMessage.send("no pomodoro is currently running, reply to me to start one, or by lazy and do nothing");
      }
    } else if (message.match(/^\s*break\s*$/i)) {
      pomodoro.startBreak();
    } else if (message.match(/^\s*clear\s*$/i)) {
      pomodoro.clearAll();
    } else {
      pomodoro.startTask(message);
    }

    res.json({ });
  });
}

module.exports.init = init;
