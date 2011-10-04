var Path = require('path');
var fs = require('fs');
var jquery = require('jquery');
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
  //   var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
  //   var win = doc.createWindow();
  //   jquery.extend(d.context, win);
  // }
  
  if (config.jasmine) {
    merge(this.context, jasmine);
  }
  
  
  if (config.jQuery) {
    this.context.jQuery = jquery;
    if (config.jQuery === "$") {
      this.context.$ = this.context.jQuery;
    }
  }
    
  if (config.CommonJS) {
    this.require = extCommonJS.require;
    this.define = extCommonJS.define;
  }
  
  return this;
};

Specking.prototype.debug =
Specking.prototype.load = function() {
  return this;
};


exports.Specking = Specking;