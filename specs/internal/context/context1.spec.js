Specking.with({ jasmine: true });

describe("First spec file", function() {
  it("should have equal specking id and context id", function() {
    describe.__temp_storage = _specking_id; // Ugly, but it works...
    expect(Specking._id).toBe(_specking_id);
    expect(Specking._id).toMatch(/^\d+$/);
  })
})