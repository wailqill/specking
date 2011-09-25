var temp = false;
config(function() {
  temp = true;
});

describe("Config function", function() {
  it("is run", function() {
    expect(temp === true);
  })
});