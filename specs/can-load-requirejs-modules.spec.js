config(function() {
  this.define = function(deps, f) {
    this.RequireModule = f();
  }
}, {
  load: 'fixtures/requirejs-module.js'
});

describe("Require JS Module", function() {
  it("should load", function() {
    expect(RequireModule.isModule).toBeTruthy();
  });
});