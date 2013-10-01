
var net = require('net');
var fs = require('fs');

var sep = /\r?\n/;

var server = function (options) {
  var listing = options.listing || "./list";
  var mtime, cached;

  function hasChanged(cb) {
    fs.stat(listing, function (err, data) {
      if (err) return cb(err);
      var changed = data.mtime !== mtime;
      mtime = data.mtime;
      cb(null, changed);
    });
  }

  function load(d, cb) {
    fs.readFile(listing, function (err, data) {
      if (err) return cb(err);
      var split = data.toString().split(sep);
      split.pop();
      d.data = split;
      cached = JSON.stringify(d);
      return cb(null, cached);
    });
  }

  var server = net.createServer(function (c) {
    var data = {};
    data.service = "list";
    data.version = "1.0";

    server.emit('log', 'client connected', c);

    c.on('end', function () {
      server.emit('log', 'client disconnected', c);
    });

    c.on('error', function (e) {
      server.emit('log', 'client error', e);
    });

    hasChanged(function (err, changed) {
      server.emit('log', 'sending...');
      if (!changed) {
        c.write(cached);
        c.end();
      }
      else {
        load(data, function (err, cached) {
          if (err) {
            c.emit('log', 'error', err);
            return;
          }
          c.write(cached);
          c.end();
        });
      }
    });
  });

  server.on('error', function (e) {
    server.log('log', 'error', e);
  });

  return server;
};

var client = function (port, host, cb) {
  var all = "";
  var client = net.connect(port, host)

  client.on('data', function (data) {
    all += data.toString();
  });

  client.on('end', function () {
    cb(null, JSON.parse(all));
  });

  return client;
};

module.exports.client = client;
module.exports.server = server;

