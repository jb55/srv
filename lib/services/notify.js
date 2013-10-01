
var json = require('./json');
var server = json({ name: 'notify', version: '1.0'});

server.on('connection', function (c) {
  c.on('json', function (data) {
    server.emit('notify', data, c);
    // response?
    c.end();
  });
});

module.exports = server; 
