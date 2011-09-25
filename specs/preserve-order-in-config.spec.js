config(
// First  
{
  DOM: true
},
// Second
function() {
  // console.dir("Second")
  if (!window.jQuery && typeof(HTMLDocument) !== 'undefined')
    window.orderTestCounter = 1;
},
// Third
{
  jQuery: true
},
// Fourth
function() {
  // console.dir("Fourth")
  if (jQuery && window.orderTestCounter === 1)
    window.orderTestCounter = "OK"
}

);


describe("", function() {
  it("", function() {
    expect(window.orderTestCounter).toBe("OK");
  });
});