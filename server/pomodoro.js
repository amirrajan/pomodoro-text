var env = process.env;
var textMessage = require('./textMessage');
var currentPomodoro = { };
var currentPomodoroBreak = { };
var pomodoroLength = 25;
var breakLength = 7;

function exec(message) {
  currentPomodoroBreak = { };
  currentPomodoro = {
    title: message,
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(pomodoroLength))
  };

  textMessage.send(currentPomodoro.title + " started at " + new Date());
  setTimeout(function() { startBreak(); }, minutes(25));
}

function startBreak() {
  textMessage.send("take a break!");
  currentPomodoro = { };
  currentPomodoroBreak = { 
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(breakLength))
  };

  setTimeout(function() {
    if(isOnBreak()) {
      textMessage.send("back to work!");
      currentPomodoroBreak = { };
    }
  }, minutes(5));
}

function currentBreak() {
  currentPomodoroBreak.minutesLeft = (currentPomodoroBreak.endTime - new Date()) / minutes(1);
  return currentPomodoroBreak;
}

function minutes(value) {
  return 1000 * 60 * value;
}

function current() {
  currentPomodoro.minutesLeft = (currentPomodoro.endTime - new Date()) / minutes(1);
  return currentPomodoro;
}

function isRunning() {
  return current().startTime;
}

function isOnBreak() {
  return currentBreak().startTime;
}

module.exports.exec = exec;
module.exports.current = current;
module.exports.currentBreak = currentBreak;
module.exports.isRunning = isRunning;
module.exports.isOnBreak = isOnBreak;
module.exports.startBreak = startBreak;
