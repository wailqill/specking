require('./../libs/Function.prototype.js');

var pp = require('./tooling.js').pp;
var merge = require('./tooling.js').merge;
var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var Specking = require('./specking.js').Specking;

function SpecRunner(specpath) {
  this.specpath = specpath;
  var f = loadFileAsFunction(specpath);
  if (f) {
    f(speckingCreator.curry(this), specpath, Path.dirname(specpath));
  }
};

function speckingCreator(sr, context) {
  context.Specking = new Specking(context, sr.specpath);
};

function loadFileAsFunction(path) {
  var func = null;
  if (Path.existsSync(path) && fs.statSync(path).isFile()) {
    try {
      var code = fs.readFileSync(path, 'utf8'),
          wrappedCode = '(function(__setupContext, __filename, __dirname) { __setupContext(this);' + code + '})';
      func = vm.runInThisContext(wrappedCode, path);
    } catch(e) {
    }
  }
  return func;
}

exports.SpecRunner = SpecRunner;