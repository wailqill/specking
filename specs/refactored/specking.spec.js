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