var jsdom = require('jsdom');
var sys = require('sys');
var fs = require('fs');
var vm = require('vm');
var Path = require('path');
var jquery = require('jquery');
var jasmine = require('./libs/jasmine-v1.1.0.js');
var TerminalReporter = require('./libs/terminal-reporter.js').TerminalReporter;
var defaultOptions = {
  jasmine: true,
  DOM: false,
  jQuery: false
}

function runner(folder) {
  var files = getSpecFiles(folder);
  var env = jasmine.jasmine.getEnv();
  env.addReporter(new TerminalReporter({
    color: true
  }));
  files.forEach(function(specFile) {
    var configFunction = jquery.noop,
        srcFiles = [],
        realSandbox = setupSandbox({
          config: configFunction
        }),
        configSandbox = setupSandboxConsole({
          config: function() {
            var arg, args = Array.prototype.slice.call(arguments, 0);
            while (arg = args.shift()) {
              if (arg instanceof Function)
                configFunction = arg;
              else if (typeof(arg) === 'object') {
                realSandbox = setupSandbox(realSandbox, arg);
                if (arg.load) {
                  if (typeof(arg.load) === 'string')
                    srcFiles.push(arg.load);
                  else if (options.load instanceof Array)
                    srcFiles.push.apply(srcFiles, arg.load);
                }
              }
            }
          }
        });
    
    var spec = fs.readFileSync(specFile, 'utf8');
    var specScript = vm.createScript(spec, specFile);
    // Setup context/sandbox, can't change while running.
    // Wrap in try/catch to cater for 'describe' or other test
    // framework code not available in the sandbox.
    try {
      specScript.runInNewContext(configSandbox);
    } catch(e) {
    }
    // Run script again, with the changed sandbox.
    var context = vm.createContext(realSandbox);
    // console.dir(srcFiles)
    var dir = Path.dirname(specFile);
    srcFiles.forEach(function(src) {
      var file = Path.normalize(dir + "/" + src);
      var code = fs.readFileSync(file, 'utf8');
      vm.runInContext(code, context);
    })
    specScript.runInContext(context);
  })
  env.execute();
}
function setupSandboxConsole(sandbox) {
  sandbox.console = sandbox.console || console;
  sandbox.console.dir = sandbox.console.dir || console.dir;
  return sandbox;
}

function setupSandbox(sandbox, options) {
  options = jquery.extend({}, defaultOptions, options || {});

  if (options.DOM) {
    var doc = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
    var win = doc.createWindow();
    jquery.extend(sandbox, win);
  }
  
  if (options.jasmine) {
    jquery.extend(sandbox, jasmine);
  }
  
  if (options.jQuery) {
    sandbox.jQuery = jquery;
    if (options.jQuery === "$") {
      sandbox.$ = sandbox.jQuery;
    }
  }
  setupSandboxConsole(sandbox);
  return sandbox;
}


function getSpecFiles(folder) {
  var files = [];
  var stat = fs.statSync(folder);
  if (stat.isFile()) {
    files.push(folder);
  } else {
    fs.readdirSync(folder).forEach(function(file) {
      files.push.apply(files, getSpecFiles(Path.join(folder, file)));
    });
  }
  return files;
}


exports.runner = runner;