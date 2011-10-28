Specking
  .with({
    jasmine: true,
    CommonJS: true
  });

describe("CommonJS with true value only don't have any fakes but", function() {
  it("should expose a require method", function() {
    expect(require).toBeDefined();
  });
  it("should load a module correctly", function() {
    expect(require('specs/fixtures/commonjs-module.js').Bubblegum).toBeDefined();
  });
});