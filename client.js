
var list = require('./services/list');
var port = 31313;

list.client(port, 'localhost', function(err, xs) {
  console.log(xs);
});
