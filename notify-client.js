
var net = require('net');
var query = require('./lib/query');
var argv = require('optimist')
    .usage('usage: notify -t test@example.com -m message')
    .demand(['t', 'm'])
    .argv;

var target = argv.t;
var msg = argv.m;
var from = argv.f;
var timeout = argv.timeout || 1000;

var split = target.split('@');
var domain = split[1];

query({ name: 'notify', domain: domain }, function (err, data) {
  data = data[0];
  var client = net.connect(data.port, data.name, function (c) {
    var packet = {
      to: target,
      from: from,
      msg: msg
    };

    console.log("Sending notification to '" + target + "' ...");
    client.write(JSON.stringify(packet));
  });

  client.setTimeout(timeout, function() {
    console.log("Timed out after " + timeout + " ms, set with --timeout ms");
    client.destroy();
  });
});
