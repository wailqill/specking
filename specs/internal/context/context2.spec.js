Specking.with({ jasmine: true });

describe("Second spec file", function() {
  it("should also have equal specking id and context id but NOT the same as the last file", function() {
    expect(Specking._id).toBe(_specking_id);
    expect(_specking_id).not.toBe(describe.__temp_storage);
  })
})