
var list = require('./services/list');
var server = list.server({ listing: './list' });
var port = process.argv[2] || 31313;

server.listen(port, function() {
  server.on('log', function (msg) {
    console.log(msg);
  });
  console.log("list server listening on " + port);

});
