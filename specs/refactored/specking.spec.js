Specking
  .with({
    jasmine: true,
    CommonJS: true
  })
  .require('../../src/specking.js', 'Module');

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
      it('should load jQuery as $ too if set to $', function() {
        s.with({ jQuery: '$' });
        expect(context.jQuery).toBeDefined();
        expect(context.$).toBeDefined();
      });
    });
  });
  
  
  describe('without CommonJS', function() {
    it('should not expose a require method', function() {
      var s = new Module.Specking();
      expect(s.require).not.toBeDefined();
    });
  });
  describe('with CommonJS', function() {
    describe("'require' method", function() {
      it("should be chainable", function() {
        var s = new Module.Specking().with({ CommonJS: true });
        expect(s.require()).toBe(s);
      });
      it('should load a CommonJS module and expose it as requested', function() {
        expect(Module.Specking).toBeDefined();
      });
    });
  });
});