var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var tools = require('./tools.js');

function speckingRequire(path, name) {
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

function speckingDefine(path, module) {
  path = Path.resolve(Path.join(Path.dirname(this.specpath), path));
  this.CommonJS = this.CommonJS || {
    fakes: {}
  };
  this.CommonJS.fakes[path] = module;
  
  return this;
};

exports.define = speckingDefine;
exports.require = speckingRequire;