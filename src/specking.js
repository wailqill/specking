require('./../libs/Function.prototype.js');

var jsdom = require('jsdom');
var sys = require('sys');
var fs = require('fs');
var vm = require('vm');
var Path = require('path');
var jquery = require('jquery');
var util = require('util');
var jasmine = require('./../libs/jasmine-v1.1.0.js');
var TerminalReporter = require('./../libs/terminal-reporter.js').TerminalReporter;

var defaultConfig = {
  jasmine: true,
  DOM: false,
  jQuery: false
};
var defaultOptions = {
  matcher: /\.specs?\.js/i
};

function runner(folder, options) {
  options = jquery.extend({}, defaultOptions, options || {});
  
  var files = getSpecFiles(folder, options);
  var env = jasmine.jasmine.getEnv();
  env.addReporter(new TerminalReporter({
    color: true
  }));
  
  files.forEach(singleSpecRunner.curry(env, options));
  
  env.execute();
};

function singleSpecRunner(env, options, specFile) {
  // Define the real config used when running the specs.
  var realSandbox = {
    // No-op implementation of config function.
    config: jquery.noop,
    pp: function(s) {
      console.log(util.inspect(s));
    }
  };
  // Add console support to the real sandbox.
  configureConsoleForSandbox(realSandbox);
  
  // Create "config sandbox" for running the config contents of the real sandbox.
  var configSandbox = {
    config: configFunction.curry(realSandbox, specFile)
  };
  configureConsoleForSandbox(configSandbox);
  
  var specCode = fs.readFileSync(specFile, 'utf8');
  var specScript = vm.createScript(specCode, specFile);
  // Setup context/sandbox, can't change while running.
  // Wrap in try/catch to cater for 'describe' or other test
  // framework code not available in the sandbox.
  try {
    specScript.runInNewContext(configSandbox);
  } catch(e) {
  }
  
  specScript.runInNewContext(realSandbox);
};

function loadFileIntoSandbox(specFile, depFile, sandbox) {
  var dir = Path.dirname(specFile);
  var depFile = Path.normalize(dir + "/" + depFile);
  var code = fs.readFileSync(depFile, 'utf8');
  vm.runInNewContext(code, sandbox, depFile);
};

function configureConsoleForSandbox(sandbox) {
  sandbox.console = sandbox.console || console;
  sandbox.console.dir = sandbox.console.dir || console.dir;
};
function configFunction(sandbox, specFile) {
  var arg,
      allUserConfigs = [],
      args = Array.prototype.slice.call(arguments, configFunction.length);
  
  while (arg = args.shift()) {
    if (typeof(arg) === 'function') {
      var code = "(" + arg.toString() + ").call(this)";
      vm.runInNewContext(code, sandbox);
    } else if (typeof(arg) === 'object') {
      allUserConfigs.push.apply(allUserConfigs, configureSandbox(sandbox, arg));
      if (arg.load) {
        allUserConfigs.push('load');
        if (typeof(arg.load) === 'string')
          loadFileIntoSandbox(specFile, arg.load, sandbox);
        else if (arg.load.forEach) // Check with instanceof or typeof is now working here
          arg.load.forEach(function(file) {
            loadFileIntoSandbox(specFile, file, sandbox);
          });
      }
    }
  }
  
  var config = {};
  for (var key in defaultConfig) {
    if (allUserConfigs.indexOf(key) < 0) {
      config[key] = defaultConfig[key]
    }
  }
  
  // And finally set all default configs not already specified by the user.
  configureSandbox(sandbox, config);
};

function configureSandbox(sandbox, config) {
  var _ = [];

  if (config.DOM) {
    _.push('DOM');
    var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
    var win = doc.createWindow();
    jquery.extend(sandbox, win);
  }
  
  if (config.jasmine) {
    _.push('jasmine');
    jquery.extend(sandbox, jasmine);
  }
  
  if (config.jQuery) {
    _.push('jQuery');
    sandbox.jQuery = jquery;
    if (config.jQuery === "$") {
      sandbox.$ = sandbox.jQuery;
    }
  }
  
  return _;
}


function getSpecFiles(folder, options) {
  var files = [];
  var stat = fs.statSync(folder);
  if (stat.isFile()) {
    if (options.matcher.test(Path.basename(folder))) {
      files.push(folder);
    }
  } else {
    fs.readdirSync(folder).forEach(function(file) {
      files.push.apply(files, getSpecFiles(Path.join(folder, file), options));
    });
  }
  return files;
}


exports.runner = runner;