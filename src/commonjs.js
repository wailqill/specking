var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var tools = require('./tools.js');

exports.require = function(name, path) {
  path = Path.resolve(Path.join(Path.dirname(this.specpath), path));
  var template = '(function(exports, require) { ##code## })';
  var f = tools.loadFileAsFunction(path, template);
  if (f) {
    var module = {};
    f(module, require);
    this.context[name] = module;
  }
  return this;
};

exports.define = function(name, module) {
  this.context[name] = module;
  
  return this;
};