var redis = require("redis");
var client = null;
var _ = require("underscore");

if(process.env.REDISTOGO_URL) { //heroku 
  client = require('redis-url').connect(process.env.REDISTOGO_URL);
} else {
  client = redis.createClient();
}

function tasks(callback) {
  client.hgetall("tasks", function(err, data) {
    for(var key in data) {
      data[key] = JSON.parse(data[key]);
    }
    return callback && callback(data);
  });
}

function saveTask(task) {
  var id = task.startTime.getTime();
  task.id = id;
  client.hset('tasks', id, JSON.stringify(task));
}

module.exports.tasks = tasks;
module.exports.saveTask = saveTask;
