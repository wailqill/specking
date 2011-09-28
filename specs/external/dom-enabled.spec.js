Specking.with({
  jasmine: true,
  DOM: true
});

describe("With DOM: true", function() {
  it("is loaded", function() {
    expect(typeof(HTMLDocument)).toNotBe('undefined');
  })
});
