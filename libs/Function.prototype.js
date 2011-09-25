Function.prototype.curry = function curry() {
  var fn = this,
    args = Array.prototype.slice.call(arguments);
  return function curried() {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  };
};