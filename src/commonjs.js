var Path = require('path');
var fs = require('fs');
var vm = require('vm');
var tools = require('./tools.js');

function getExportsFromFile(specking, path) {
  var fullpath = Path.resolve(Path.join(Path.dirname(specking.specpath), path));
  var template = '(function(exports, require) { ##code## })';
  var f = tools.loadFileAsFunction(fullpath, template);
  if (f) {
    var module = {};
    f(module, contextRequire.curry(specking));
    return module;
  }
  return null;
};

function speckingRequire(specking, path, name) {
  var module = getExportsFromFile(specking, path);
  specking.context[name] = module;
  return specking;
};

function speckingDefine(path, module) {
  path = Path.resolve(Path.join(Path.dirname(this.specpath), path));
  this.CommonJS = this.CommonJS || {
    fakes: {}
  };
  this.CommonJS.fakes[path] = module;
  
  return this;
};

function contextRequire(specking, dependency) {
  var fullpath = Path.resolve(Path.join(Path.dirname(specking.specpath), dependency));
  var module;
  
  // Check if the module is a fake
  // pp("wrappedRequire " + path)
  // if (dependency in specking.CommonJS.fakes) {
  //   return specking.CommonJS.fakes[dependency];
  // }
    
  
  // Check if the file exists on disk, if so load it up with the same
  // wrappedRequire method available.
  if (Path.existsSync(fullpath) && fs.statSync(fullpath).isFile()) {
    // try {
      
      var template = '(function(exports, require, __filename) { ##code## })';
      var f = tools.loadFileAsFunction(fullpath, template);
      if (f) {
        var module = {};
        f(module, contextRequire, fullpath);
        return module;
      }
      
      
      
      
      
    //   var code = fs.readFileSync(fullpath, 'utf8'),
    //       code = '(function(require, exports, __filename) {' + code + '})';
    //   module = {};
    //   vm.runInThisContext(code, fullpath)(contextRequire.curry(specking), module, fullpath);
    //   return module;
    // } catch(e) {
    // }
  }





    // 
    // var wrappedRequire = function(specdir, fakes, dependency) {
    //   var path = Path.join(specdir, dependency);
    // 
    //   // Check if the module is a fake
    //   // pp("wrappedRequire " + path)
    //   var _ = fakes[dependency];
    //   if (_) return _;
    // 
    //   // Check if the file exists on disk, if so load it up with the same
    //   // wrappedRequire method available.
    //   if (Path.existsSync(path) && fs.statSync(path).isFile()) {
    //     try {
    //       var code = fs.readFileSync(path, 'utf8'),
    //           code = '(function(require, exports, __filename) {' + code + '})';
    //       _ = {};
    //       vm.runInThisContext(code, path)(wrappedRequire.curry(specdir, fakes), _, path);
    //       return _;
    //     } catch(e) {
    //     }
    //   }
    //   // Else load it as a real module.
    //   try {
    //     _ = require(dependency);
    //   } catch(e) {
    //     _ = null;
    //   }
    //   // pp(indent + 'return real module')
    //   return _;
    // };
  
  
  try {
    module = require(dependency);
  } catch(e) {
    module = null;
  }
  
  return module;
  
  // return getExportsFromFile(path);
};

exports.speckingDefine = speckingDefine;
exports.speckingRequire = speckingRequire;
exports.contextRequire = contextRequire;