Specking
  .with({
    jasmine: true,
    CommonJS: true
  });

describe("Configurable", function() {
  var Configurable,
      src = '../../src/configurable.js';
      
  beforeEach(function() {
    Configurable = require(src).Configurable;
  });
  
  it("should be defined", function() {
    expect(Configurable).toBeDefined();
  });
  
  describe("method 'with'", function() {
    var c, context;
    beforeEach(function() {
      context = {};
      c = new Configurable(context);
    });
    it("is defined", function() {
      expect(c.with).toBeDefined();
    });
    it("should be able to load a DOM into the context", function() {
      c.with({ DOM: true });
      expect(context.HTMLDocument).toBeDefined();
    });
    it("should be able to load jasmine into the context", function() {
      c.with({ jasmine: true });
      expect(context.jasmine).toBeDefined();
    });
    describe("and specifying jQuery", function() {
      it("with true should expose it as jQuery only", function() {
        c.with({ jQuery: true });
        expect(context.jQuery).toBeDefined();
        expect(context.$).toBeUndefined();
      });
      it("with dollar should expose it as jQuery and $", function() {
        c.with({ jQuery: '$' });
        expect(context.jQuery).toBeDefined();
        expect(context.$).toBeDefined();
      });
    });
    it("should work with chained invokations", function() {
      c.with({ jasmine: true }).with({ DOM: true });
      expect(context.jasmine).toBeDefined();
      expect(context.HTMLElement).toBeDefined();
    });
  });
  
  describe("expose the environment", function() {
    it("should contain the dir of the spec file", function() {
      var c = new Configurable({}, 'specs/internal/configurable.spec.js');
      var lastPart = c.env.specdir.substr(c.env.specdir.length - 15);
      expect(lastPart).toBe('/specs/internal');
    });
  });
  
  describe("RequireJS support", function() {
    it("should throw when using require method when not using RequireJS", function() {
      var c = new Configurable();
      expect(c.require).toThrow();
    });
    it("should load a RequireJS module with the require method and expose it", function() {
      var context = {};
      var c = new Configurable(context, 'specs/internal/configurable.spec.js')
        .with({ RequireJS: true })
        .require('ModuleName', '../fixtures/requirejs-module.js');
      
      expect(context.ModuleName.isModule).toBeTruthy();
    });
  });
});