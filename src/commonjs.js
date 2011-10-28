var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var tools = require('./tools.js');

function getExportsFromFile(path) {
  path = Path.resolve(Path.join(Path.dirname(this.specpath), path));
  var template = '(function(exports, require) { ##code## })';
  var f = tools.loadFileAsFunction(path, template);
  if (f) {
    var module = {};
    f(module, contextRequire);
    return module;
  }
  return null;
};

function speckingRequire(path, name) {
  var module = getExportsFromFile(path);
  this.context[name] = module;
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

function contextRequire(path) {
  return getExportsFromFile(path);
};

exports.speckingDefine = speckingDefine;
exports.speckingRequire = speckingRequire;
exports.contextRequire = contextRequire;