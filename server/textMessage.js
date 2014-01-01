var env = process.env;
var client = require('twilio')(env.twilioAccountSid, env.twilioAuthToken);

function send(message) {
  console.log(message);
  /*
  client.sendSms({
    to: env.mobile,
    from: env.twilioAssignedPhoneNumber,
    body: message
  }, function(err, responseData) { 
  });
  */
}

module.exports.send = send;
