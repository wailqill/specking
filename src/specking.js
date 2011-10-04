var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var pp = require('./tooling.js').pp;
var merge = require('./tooling.js').merge;
var extCommonJS = require('./commonjs.js');
var jasmine = require('./../libs/jasmine-v1.1.0.js');

function Specking(context, specpath) {
  this.specpath = specpath;
  this.context = context;
};
Specking.prototype.with = function(config) {
  config = config || {};
  
  // if (config.DOM) {
  //   d.userConfigs.push('DOM');
  //   var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
  //   var win = doc.createWindow();
  //   jquery.extend(d.context, win);
  // }
  
  if (config.jasmine) {
    // d.userConfigs.push('jasmine');
    merge(this.context, jasmine);
  }
  
  
  // if (config.jQuery) {
  //   d.userConfigs.push('jQuery');
  //   d.context.jQuery = jquery;
  //   if (config.jQuery === "$") {
  //     d.context.$ = d.context.jQuery;
  //   }
  // }
  
  if (config.CommonJS) {
    Specking.prototype.require = extCommonJS.require;
  }
  
  return this;
};

Specking.prototype.debug =
Specking.prototype.load = function() {
  return this;
};


exports.Specking = Specking;