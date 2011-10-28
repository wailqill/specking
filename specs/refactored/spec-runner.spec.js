Specking
  .with({
    jasmine: true,
    CommonJS: true
  })
  .require('../../src/spec-runner.js', 'SpecRunner');
  
describe("test", function() {
  it("teststs", function() {
    expect(SpecRunner).toBeDefined();
  });
});