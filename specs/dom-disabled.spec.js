config({
  DOM: false
});

describe("With DOM: false", function() {
  it("is not loaded", function() {
    expect(typeof(HTMLDocument) === 'undefined')
  })
});