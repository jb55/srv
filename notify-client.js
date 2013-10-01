
var net = require('net');
var query = require('./lib/query');
var argv = require('optimist')
    .usage('usage: notify -t test@example.com -m message')
    .demand(['t', 'm'])
    .argv;

var target = argv.t || process.argv[2];
var msg = argv.m || process.argv[3];
var timeout = argv.timeout || 1000;

var split = target.split('@');
var domain = split[1];
var to = split[0];

query({ name: 'notify', domain: domain }, function (err, data) {
  data = data[0];
  var client = net.connect(data.port, data.name, function (c) {
    var packet = {
      to: to,
      msg: msg
    };

    console.log("Sending notification to '" + target + "' ...");
    c.write(JSON.stringify(packet));
  });

  client.setTimeout(timeout, function() {
    console.log("Timed out after " + timeout + " ms, set with --timeout ms");
    client.destroy();
  });
});
