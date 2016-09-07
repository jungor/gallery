var Event = {
  _handlers: {},
  on: function(eventName, callback) {
    if (this._handlers.hasOwnProperty(eventName)) {
      this._handlers[eventName].push(callback);
    } else {
      this._handlers[eventName] = [callback];
    }
  },
  emit: function(eventName) {
    if (this._handlers.hasOwnProperty(eventName)) {
      for (let cb of this._handlers[eventName]) {
        cb.call(null, Array.prototype.slice.call(arguments, 1));
      }
    }
  }
};

Event.on('test', function(){
  console.log('hello');
});

Event.on('test', function(name){
  console.log('hello '+ name);
});

Event.emit('test');
Event.emit('test', 'jj');
