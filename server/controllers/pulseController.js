var authorized = require('./accountController').authorized;
var http_url = require('url');
var http_request = require('request');

function init(app) {
  app.get('/pulse', function (req, res) {
    res.json({ });
  });
}

setInterval(function() {
  var url = process.env.deployUrl;
  var resolved = http_url.resolve(url, "/pulse"); 
  http_request(resolved, function (error, response, data) { });
}, 1000);

module.exports.init = init;
