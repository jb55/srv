
var dns = require('dns');
var list = require('./services/list');

var resolve = module.exports = function resolve(service, cb) {
  dns.resolveSrv(service.srv, function (err, data) {
    cb(err, data);
  });
};

function query(data) {
  var protocol = data.protocol || "tcp";
  return {
    name: data.name,
    protocol: protocol,
    domain: data.domain,
    srv: "_" + data.name + "._" + protocol + "." + data.domain
  };
}

var queryList = query({ name: "list", domain: process.argv[2] });

resolve(queryList, function (err, data) {
  if (err && err.code === "ENOTFOUND") {
    console.log(queryList);
    console.log("No '" + queryList.name + "' service found @" + queryList.domain);
    return;
  }
  data = data[0];

  console.log('srv:', data);
  list.client(data.port, data.name, function(err, xs) {
    console.log("services: ", xs);
  });
});
