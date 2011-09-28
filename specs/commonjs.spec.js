Specking
  .with({
    jasmine: true,
    CommonJS: {
      'vm': { module: 'vm' }
    }
  });

describe("CommonJS", function() {
  it("should expose a require method", function() {
    expect(require).toBeDefined();
  });
  it("should load a fake when specified in the CommonJS object in Specking", function() {
    expect(require('vm').module).toBe('vm')
  });
});