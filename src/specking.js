var Path = require('path');
var fs = require('fs');
var jquery = require('jquery');
var vm = require('vm');
var tools = require('./tools.js');
var pp = require('./tools.js').pp;
var extCommonJS = require('./commonjs.js');
var jasmine = require('./../libs/jasmine-v1.1.0.js');

var counter = 0;
function Specking(context, specpath) {
  this.specpath = specpath;
  this.context = context;
  this._id = counter++;
  this.context._specking_id = this._id;
};
Specking.prototype.with = function(config) {
  config = config || {};
  
  // if (config.DOM) {
  //   var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
  //   var win = doc.createWindow();
  //   jquery.extend(d.context, win);
  // }
  
  if (config.jasmine) {
    tools.merge(this.context, jasmine);
  }
  
  
  if (config.jQuery) {
    this.context.jQuery = jquery;
    if (config.jQuery === "$") {
      this.context.$ = this.context.jQuery;
    }
  }
    
  if (config.CommonJS) {
    this.require = extCommonJS.speckingRequire.curry(this);
    this.define = extCommonJS.speckingDefine.curry(this);
    this.context.require = extCommonJS.contextRequire.curry(this);
  }
  
  return this;
};

Specking.prototype.load = function(path) {
  var self = this;
  var fullpath = Path.resolve(Path.join(Path.dirname(self.specpath), path));
  var code = fs.readFileSync(fullpath, 'utf8');
  vm.runInNewContext(code, this.context);
};

Specking.prototype.do = function(func) {
  var code = '(' + func.toString() + ')()';
  vm.runInNewContext(code, this.context);
};

Specking.prototype.debug = function() {
  return this;
};


exports.Specking = Specking;