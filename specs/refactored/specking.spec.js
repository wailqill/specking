Specking
  .with({
    jasmine: true,
    CommonJS: true
  })
  .require('Module', '../../src/specking.js');

describe("Specking", function() {
  describe('.with()', function () {
    
    it("should be chainable", function() {
      var s = new Module.Specking();
      expect(s.with()).toBe(s);
    });
    
    describe('with jasmine:true', function() {
      var context = {};
      new Module.Specking(context).with({ jasmine: true });
      
      it('should expose describe', function() {
        expect(context.describe).toBeDefined();
      });
      it('should expose it', function() {
        expect(context.it).toBeDefined();
      });
      it('should expose beforeEach', function() {
        expect(context.beforeEach).toBeDefined();
      });
      it('should expose afterEach', function() {
        expect(context.afterEach).toBeDefined();
      });
    });
    
    describe('with jQuery', function() {
      var context, s;
      beforeEach(function() {
        context = {};
        s = new Module.Specking(context);
      });
      
      it('should not load jQuery if not specified', function() {
        expect(context.jQuery).not.toBeDefined();
      });
      it('should load jQuery if set to true', function() {
        s.with({ jQuery: true });
        expect(context.jQuery).toBeDefined();
        expect(context.$).not.toBeDefined();
      });
      it("should load jQuery as $ too if set to $", function() {
        s.with({ jQuery: "$" });
        expect(context.jQuery).toBeDefined();
        expect(context.$).toBeDefined();
      });
    });
  });
  
  describe('.load()', function() {
    it('should load a file from disk into global scope', function() {
      var context = {};
      s = new Module.Specking(context, __filename);
      s.load('../fixtures/animals.js');
      expect(context.Cat).toBeDefined();
    })
  });
  
  describe('.do()', function() {
    it('should execute arbitrary code', function() {
      var context = {};
      s = new Module.Specking(context, __filename);
      s.do(function() {
        this.Pixel = true;
      });
      expect(context.Pixel).toBe(true);
    })
  });
  
  
  describe('CommonJS', function() {
    var context, s;
    beforeEach(function() {
      context = {};
      s = new Module.Specking(context, __filename);
    });
    it('should not expose a require method when not specified', function() {
      expect(s.require).not.toBeDefined();
    });
    describe("'require' method", function() {
      beforeEach(function() {
        s.with({ CommonJS: true });
      });
      it("should be chainable", function() {
        expect(s.require()).toBe(s);
      });
      it('should load a CommonJS module and expose it as requested', function() {
        s.require('Module', '../fixtures/commonjs-module.js')
        expect(context.Module.Bubblegum).toBeDefined();
      });
    });
    it('should not expose a define method if not in use', function() {
      expect(s.define).not.toBeDefined();
    });
    describe('faking modules', function() {
      beforeEach(function() {
        s.with({ CommonJS: true });
      });
      it('should expose a define method', function() {
        expect(s.define).toBeDefined();
      });
      it('should use a fake module if defined', function() {
        s.define('Module', { Glenn: "" });
        expect(context.Module.Glenn).toBe("");
      });
    })
  });
});