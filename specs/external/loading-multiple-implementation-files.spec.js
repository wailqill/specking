Specking
  .with({ jasmine: true })
  .load('../fixtures/animals.js')
  .load('../../specs/fixtures/vehicles.js');

describe("Multiple file loads", function() {
  it('should load all files', function() {
    expect(new Cat()).toBeTruthy();
    expect(new Vehicle()).toBeTruthy();
  })
});