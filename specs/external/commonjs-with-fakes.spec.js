Specking
  .with({
    jasmine: true,
    CommonJS: {
      'vm': { fakeModule: true }
    }
  });

describe("CommonJS", function() {
  it("should expose a require method", function() {
    expect(require).toBeDefined();
  });
  
  describe("when used in the spec file itself", function() {
    it("should load a fake when specified in the CommonJS object in Specking", function() {
      expect(require('vm').fakeModule).toBeTruthy();
    });
    it("should load the real thing when not specified in the CommonJS object in Specking", function() {
      expect(require('fs').rename).toBeDefined();
    });
    it("should load a real file if specified", function() {
      expect(require('../fixtures/commonjs-module.js').Bubblegum).toBeDefined();
    });
  });
  
  describe("when used in a dependency of the spec file", function() {
    var mod = require('../fixtures/commonjs-module-with-deps.js').Module;
    it("should load a fake when specified in the CommonJS object in Specking", function() {
      expect(mod.vm.fakeModule).toBeTruthy();
    });
    it("should load the real thing when not specified in the CommonJS object in Specking", function() {
      expect(mod.fs.rename).toBeDefined();
    });
    // it("should load a real file if specified", function() {
    //   expect(mod.code.Bubblegum).toBeDefined();
    // });
  });
});