config({
  load: '../src/implementation.js'
});

describe("Cat", function() {
  it('should eat like an animal', function() {
    var cat = new Cat();
    expect(cat.eat()).toBe('Yum!');
  })
});