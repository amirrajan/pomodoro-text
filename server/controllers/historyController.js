var authorized = require('./accountController').authorized;
var history = require('../models/history');


function init(app) {
  app.get('/history', authorized, function (req, res) {
    res.render('history');
  });

  app.get('/history/tasks', authorized, function (req, res) {
    history.tasks(function(tasks) {
      res.json(tasks);
    });
  });

  app.post('/history/delete', authorized, function (req, res) {
    history.deleteTask(req.body.id);
    res.json({ });
  });
}

module.exports.init = init;
