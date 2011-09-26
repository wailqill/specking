Specking.with({
  DOM: false,
  jasmine: true
});

describe("With DOM: false", function() {
  it("is not loaded", function() {
    expect(typeof(HTMLDocument) === 'undefined')
  })
});