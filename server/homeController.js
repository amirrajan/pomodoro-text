var authorized = require('./accountController').authorized;
var pomodoro = require('./pomodoro');
var textMessage = require('./textMessage');

function init(app) {
  app.get('/', authorized, function (req, res) {
    res.render('index');
  });

  app.get('/current', authorized, function(req, res) {
    res.json(pomodoro.current());
  });

  app.get('/break', authorized, function(req, res) {
    res.json(pomodoro.currentBreak());
  });

  app.post('/text', function(req, res) {
    var message = req.body.Body;

    if(message.match(/status/i)) {
      if(pomodoro.isRunning()) {
        var current = pomodoro.current();
        textMessage.send(current.title + " - " + Math.round(current.minutesLeft) + " minute(s) left.");
      } else if(pomodoro.isOnBreak()) {
        var current = pomodoro.currentBreak();
        textMessage.send("yay! you're on a break - " + Math.round(current.minutesLeft) + " minute(s) left.");
      } else {
        textMessage.send("no pomodoro is currently running, reply to me to start one.");
      }
    } else if (message.match(/break/i)) {
      pomodoro.startBreak();
    } else {
      pomodoro.exec(message);
    }

    res.json({ });
  });
}

module.exports.init = init;
