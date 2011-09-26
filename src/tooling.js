var util = require('util');

function prettyPrint() {
  Array.prototype.slice.call(arguments, 0).forEach(function(o) {
    console.log(util.inspect(o));
  });
}

exports.pp = prettyPrint
