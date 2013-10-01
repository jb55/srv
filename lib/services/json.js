
var service = require('./service');
var Parser = require('jsonparse');


function JsonService (options) {
  var server = service(options);

  server.on('connection', function (c) {
    var p = new Parser();

    p.onValue = function (value) {
      if (this.stack.length === 0) {
        c.emit('json', value);
      }
    };

    c.on("data", function (chunk) {
      p.write(chunk);
    });

    c.on("end", function () {
    });
  });

  return server;
}

module.exports = JsonService;
