Specking
  .with({
    jasmine: true,
    CommonJS: true
  })
  .require('SpecRunner', '../../src/spec-runner.js');
  
describe("test", function() {
  it("teststs", function() {
    expect(SpecRunner).toBeDefined();
  });
});