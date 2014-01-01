var env = process.env;
var textMessage = require('./textMessage');
var currentPomodoro = { };
var currentPomodoroBreak = { };
var pomodoroLength = 25;
var breakLength = 7;

function startTask(description) {
  clearBreak();
  currentPomodoro = {
    title: description,
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(pomodoroLength))
  };

  textMessage.send(currentPomodoro.title + " started at " + new Date());
}

function startBreak() {
  textMessage.send("take a break!");

  clearTask();
  currentPomodoroBreak = { 
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + minutes(breakLength))
  };
}

function backToWork() {
  textMessage.send("back to work!");

  clearTask();
  clearBreak();
}

function currentBreak() {
  currentPomodoroBreak.minutesLeft = (currentPomodoroBreak.endTime - new Date()) / minutes(1);
  return currentPomodoroBreak;
}

function minutes(value) {
  return 1000 * 60 * value;
}

function currentTask() {
  currentPomodoro.minutesLeft = (currentPomodoro.endTime - new Date()) / minutes(1);
  return currentPomodoro;
}

function isWorkingOnTask() {
  return currentTask().startTime;
}

function isOnBreak() {
  return currentBreak().startTime;
}

function clearTask() {
  currentPomodoro = { };
}

function clearBreak() {
  currentPomodoroBreak = { };
}

function tick() {
  if(isWorkingOnTask()) {
    if(currentTask().minutesLeft <= 0) {
      startBreak();
    }
  }

  if(isOnBreak()) {
    if(currentBreak().minutesLeft <= 0) {
      backToWork();
    }
  }
}

module.exports.startTask = startTask;
module.exports.currentTask = currentTask;
module.exports.currentBreak = currentBreak;
module.exports.isWorkingOnTask = isWorkingOnTask;
module.exports.isOnBreak = isOnBreak;
module.exports.startBreak = startBreak;
module.exports.tick = tick;
