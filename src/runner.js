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
var SpecRunner = require('./spec-runner.js').SpecRunner;
// var klasses = require('./configurable.js');
var tooling = require('./tools.js');

// var defaultConfig = {
//   jasmine: true,
//   DOM: false,
//   jQuery: false
// };
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
  
  files.forEach(function(file) {
    new SpecRunner(Path.join(__dirname, '..', file), options);
  });
    
    // singleSpecRunner.curry(env, options));
  
  env.execute();
};

















function singleSpecRunner(env, options, specFile) {
  // Define the real config used when running the specs.
  var realSandbox = {
    // No-op implementation of config function.
    Specking: klasses.FakeFactory,
    pp: tooling.pp
  };
  // Add console support to the real sandbox.
  configureConsoleForSandbox(realSandbox);
  
  // Create "config sandbox" for running the config contents of the real sandbox.
  var configSandbox = {
    Specking: klasses.ConfigurableFactory.create(realSandbox, specFile)
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

function configureConsoleForSandbox(sandbox) {
  sandbox.console = sandbox.console || console;
  sandbox.console.dir = sandbox.console.dir || console.dir;
};

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