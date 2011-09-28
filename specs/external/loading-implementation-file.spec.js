Specking
  .with({ jasmine: true })
  .load('../fixtures/animals.js');

describe("Cat", function() {
  it('should eat like an animal', function() {
    var cat = new Cat();
    expect(cat.eat()).toBe('Yum!');
  })
});