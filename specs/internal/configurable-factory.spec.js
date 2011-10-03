Specking.with({
  jasmine: true,
  CommonJS: true
});

describe("ConfigurableFactory", function() {
  var ConfigurableFactory,
      src = '../../src/configurable.js';
      
  beforeEach(function() {
    ConfigurableFactory = require(src).ConfigurableFactory;
  });
  
  it("should be defined", function() {
    expect(ConfigurableFactory).toBeDefined();
  });
  
  it("should create a configurable", function() {
    var c = ConfigurableFactory.create({}, 'fake.spec.js');
    expect(c).toBeDefined();
  });
});