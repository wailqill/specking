var util = require('util');

function prettyPrint() {
  Array.prototype.slice.call(arguments, 0).forEach(function(o) {
    console.log(util.inspect(o));
  });
}

function mergeObjects(output) {
  Array.prototype.slice.call(arguments, 1).forEach(function(o) {
    Object.keys(o).forEach(function(key) {
      output[key] = o[key];
    });
  });
}

exports.pp = prettyPrint
exports.merge = mergeObjects;