
var dns = require('dns');

module.exports = function resolveQuery (serv, cb) {
  resolve(query(serv), function (err, data) {
    if (err && err.code === "ENOTFOUND") {
      cb("No '" + serv.name + "' service found @" + serv.domain);
      return;
    }
    cb(null, data);
  });
};

var resolve = function resolve(service, cb) {
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

