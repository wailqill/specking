var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var pp = require('./tooling.js').pp;

exports.require = function(path, name) {
  path = Path.resolve(Path.join(Path.dirname(this.specpath), path));
  var f = loadFileAsFunction(path);
  if (f) {
    var module = {};
    f(module, require);
    this.context[name] = module;
  } else {
  }
  return this;
};

function loadFileAsFunction(path) {
  var func = null;
  if (Path.existsSync(path) && fs.statSync(path).isFile()) {
    try {
      var code = fs.readFileSync(path, 'utf8'),
          wrappedCode = '(function(exports, require) {' + code + '})';
      func = vm.runInThisContext(wrappedCode, path);
    } catch(e) {
    }
  }
  return func;
}
