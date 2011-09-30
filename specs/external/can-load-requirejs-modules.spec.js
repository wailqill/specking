Specking
  .with({
    jasmine: true,
    RequireJS: true
  })
  .require('RequireModule', '../fixtures/requirejs-module.js');

describe("Require JS Module", function() {
  it("should load", function() {
    expect(RequireModule.isModule).toBeTruthy();
  });
});