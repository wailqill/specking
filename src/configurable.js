require('./../libs/Function.prototype.js');
var pp = require('./tooling.js').pp;
var jsdom = require('jsdom');
var jquery = require('jquery');
var vm = require('vm');
var fs = require('fs');
var jasmine = require('./../libs/jasmine-v1.1.0.js');
var Path = require('path');

var data = [];
function arrayify(o) {
  if (!(o instanceof Array || o.forEach))
    o = [o];
  return o;
}

var ConfigurableFactory = {
  create: function(context, specFile) {
    return new Configurable(context, specFile, data.length);
  }
};

var Configurable = function(context, specFile, id) {
  Object.defineProperty(this, "id", {
    value: id,
    writable: false,
    enumerable: true,
    configurable: true
  });
  data[this.id] = {
    context: context,
    userConfigs: [],
    baseDir: Path.dirname(Path.resolve(specFile))
  };
};

Configurable.prototype.with = function(config) {
  var d = data[this.id];

  if (config.DOM) {
    d.userConfigs.push('DOM');
    var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
    var win = doc.createWindow();
    jquery.extend(d.context, win);
  }
  
  if (config.jasmine) {
    d.userConfigs.push('jasmine');
    jquery.extend(d.context, jasmine);
  }
  
  if (config.jQuery) {
    d.userConfigs.push('jQuery');
    d.context.jQuery = jquery;
    if (config.jQuery === "$") {
      d.context.$ = d.context.jQuery;
    }
  }
  return this;
};
Configurable.prototype.load = function(filepaths) {
  if (!filepaths) return this;

  var d = data[this.id];
  arrayify(filepaths).forEach(function(relativePath) {
    var fullPath = Path.normalize(d.baseDir + "/" + relativePath);
    var code = fs.readFileSync(fullPath, 'utf8');
    vm.runInNewContext(code, d.context, fullPath);
  });
  
  return this;
};
Configurable.prototype.debug = function() {
  pp(data[this.id].context);
}

var Fake = function() {};
Fake.prototype.load =
Fake.prototype.with =
Fake.prototype.debug = function() { return this; };

exports.ConfigurableFactory = ConfigurableFactory;
exports.FakeFactory = new Fake();