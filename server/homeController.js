var authorized = require('./accountController').authorized;
var pomodoro = require('./pomodoro');
var textMessage = require('./textMessage');

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

    if(message.match(/status/i)) {
      if(pomodoro.isWorkingOnTask()) {
        var currentTask = pomodoro.currentTask();
        textMessage.send(currentTask.title + " - " + Math.round(currentTask.minutesLeft) + " minute(s) left.");
      } else if(pomodoro.isOnBreak()) {
        var currentTask = pomodoro.currentBreak();
        textMessage.send("yay! you're on a break - " + Math.round(currentTask.minutesLeft) + " minute(s) left.");
      } else {
        textMessage.send("no pomodoro is currently running, reply to me to start one.");
      }
    } else if (message.match(/break/i)) {
      pomodoro.startBreak();
    } else {
      pomodoro.startTask(message);
    }

    res.json({ });
  });
}

module.exports.init = init;
