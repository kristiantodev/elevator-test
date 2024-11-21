class RequestQueue {
    constructor() {
      this.queue = [];
    }
  
    // Add a floor request to the queue
    addRequest(floor) {
      if (!this.queue.includes(floor)) {
        this.queue.push(floor);
      }
    }
  
    // Get the next floor request from the queue (FIFO)
    getNextRequest() {
      return this.queue.shift();
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  module.exports = RequestQueue;  