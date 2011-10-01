require('./../libs/Function.prototype.js');
var pp = require('./tooling.js').pp;
var jsdom = require('jsdom');
var jquery = require('jquery');
var vm = require('vm');
var fs = require('fs');
var jasmine = require('./../libs/jasmine-v1.1.0.js');
var Path = require('path');

var data = [];
var env = {};

function readonly(o, p, v) {
  Object.defineProperty(o, p, {
    value: v,
    writable: false,
    enumerable: true,
    configurable: false
  });
}
readonly(env, 'dirname', __dirname);

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
  readonly(this, 'id', id);
  readonly(this, 'env', env);
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
  
  if (config.CommonJS) {
    d.CommonJS = d.CommonJS || {
      fakes: {}
    }
    for (var key in config.CommonJS) {
      d.CommonJS[key] = config.CommonJS[key];
    }
    d.context.require = function(module) {
      // Faked module
      var _ = d.CommonJS[module];
      if (_) return _;
      
      // Real module
      try {
        _ = require(module);
      } catch(e) {
        _ = null;
      }
      if (_) return _;
      
      // Load file
      try {
        var path = Path.join(d.baseDir, module);
        _ = require(path);
      } catch(e) {
        _ = null;
      }
      return _;
    };
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
exports.Configurable = Configurable;
exports.FakeFactory = new Fake();