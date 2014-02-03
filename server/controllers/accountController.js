var env = process.env;
var textMessage = require('../models/textMessage');

function init(app) {
  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.post('/login', function (req, res) {
    if(req.body.password === env.password) {
      req.session.mobileConfirmation = Math.floor(Math.random() * 99999) + 10000;
      textMessage.send(req.session.mobileConfirmation);
      req.session.passwordCorrect = true;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });

  app.get('/login2', function (req, res) {
    if (!req.session.passwordCorrect) {
      res.redirect('/login');
    } else {
      res.render('login2');
    }
  });

  app.post('/login2', function (req, res) {
    if (!req.session.passwordCorrect) {
      res.redirect('/login');
    } else {
      if(req.body.code === req.session.mobileConfirmation.toString()) {
        req.session.mobileConfirmCorrect = true;
        res.redirect('/');
      } else {
        req.session.passwordCorrect = false;
        res.redirect('/login');
      }
    }
  });
}

function isAuthorized(req) {
  if(!env.enableAuth.bool()) return true;

  return req.session.passwordCorrect && req.session.mobileConfirmCorrect;
}

function authorized(req, res, next) {
  if(!env.enableAuth.bool()) {
    next();
  } else if(isAuthorized(req)) {
    next();
  } else if(req.session.passwordCorrect) {
    res.redirect('/login2');
  } else {
    res.redirect('/login');
  }
}

module.exports.init = init;
module.exports.authorized = authorized;
module.exports.isAuthorized = isAuthorized;
