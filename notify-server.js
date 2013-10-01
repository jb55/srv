
var server = require('./lib/services/notify');

server.on('notify', function (data) {
  console.log(typeof data, data);
});

server.listen(41414);
