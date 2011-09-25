config({
  load: ['fixtures/animals.js', 'fixtures/vehicles.js']
});

describe("Multiple file loads", function() {
  it('should load all files', function() {
    expect(new Cat()).toBeTruthy();
    expect(new Vehicle()).toBeTruthy();
  })
});