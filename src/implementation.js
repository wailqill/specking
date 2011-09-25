var Animal = function() {
  
};
Animal.prototype.eat = function() {
  return 'Yum!';
};

var Cat = function() {
  
};
Cat.prototype = new Animal;
Cat.prototype.say = function() {
  return 'Mjau!';
};