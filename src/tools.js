var util = require('util');
var Path = require('path');
var vm = require('vm');
var fs = require('fs');

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

function loadFileAsFunction(path, template, context) {
  var func = null;
  if (Path.existsSync(path) && fs.statSync(path).isFile()) {
    try {
      var code = fs.readFileSync(path, 'utf8'),
          wrappedCode = template.replace(/##code##/g, "\n" + code + "\n");
      // prettyPrint('', '', '', wrappedCode)
      if (context) {
        func = vm.runInNewContext(wrappedCode, context, path);
      } else {
        func = vm.runInThisContext(wrappedCode, path);
      }
    } catch(e) {
      prettyPrint(e.stack)
    }
  }
  return func;
}

exports.pp = prettyPrint
exports.merge = mergeObjects;
exports.loadFileAsFunction = loadFileAsFunction;