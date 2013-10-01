
var net = require('net');

function Service (options) {
  if (!options.name) throw new Error("Service name required");
  if (!options.version) throw new Error("Service version required");

  var server = net.createServer(function (c) {
    server.emit('log', 'client connected', c);

    c.on('end', function () {
      server.emit('log', 'client disconnected', c);
    });

    c.on('error', function (e) {
      server.emit('log', 'client error', e);
    });
  });

  return server;
}

module.exports = Service;

