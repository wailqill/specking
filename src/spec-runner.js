require('./../libs/Function.prototype.js');

var tools = require('./tools.js');
var pp = require('./tools.js').pp;
var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var Specking = require('./specking.js').Specking;

function SpecRunner(specpath) {
  this.specpath = specpath;
  var template = '(function(__setupContext, __filename, __dirname) { __setupContext(this); ##code## })';
  var f = tools.loadFileAsFunction(specpath, template);
  if (f) {
    f(speckingCreator.curry(this), specpath, Path.dirname(specpath));
  }
};

function speckingCreator(sr, context) {
  context.Specking = new Specking(context, sr.specpath);
};

exports.SpecRunner = SpecRunner;