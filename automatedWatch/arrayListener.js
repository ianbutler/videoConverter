function EventedArray(handler) {
  this.stack = [];
  this.mutationHandler = handler || function() {};
  this.setHandler = function(f) {
    this.mutationHandler = f;
  };
  this.callHandler = function() {
    if (typeof this.mutationHandler === "function") {
      this.mutationHandler();
    }
  };
  this.push = function(obj) {
    this.stack.push(obj);
    this.callHandler();
  };
  this.pop = function() {
    this.callHandler();
    return this.stack.pop();
  };
  this.getArray = function() {
    return this.stack;
  };
  this.length = function() {
    return this.stack.length;
  };
}

module.exports = EventedArray;
