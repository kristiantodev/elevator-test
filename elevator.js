const RequestQueue = require('./requestQueue');

class Elevator {
  constructor(io, id) {
    this.id = id; 
    this.currentFloor = 0;
    this.requests = new RequestQueue(); 
    this.moving = false;
    this.io = io;
  }

  // Request a specific floor
  requestFloor(floor) {
    this.requests.addRequest(floor);
    if (!this.moving) {
      this.processRequests();
    }
  }

  // Process requests sequentially
  async processRequests() {
    this.moving = true;
    while (!this.requests.isEmpty()) {
      const nextFloor = this.requests.getNextRequest();
      await this.moveToFloor(nextFloor);
    }
    this.moving = false;
  }

  // Move elevator to a specific floor
  async moveToFloor(floor) {
    const travelTime = Math.abs(this.currentFloor - floor) * 1800;
    console.log(`Elevator ${this.id}: Moving from floor ${this.currentFloor} to floor ${floor}`);
    this.io.emit('moving', { elevatorId: this.id, from: this.currentFloor, to: floor });
    await new Promise(resolve => setTimeout(resolve, travelTime));
    this.currentFloor = floor;
    console.log(`Elevator ${this.id}: Arrived at floor ${floor}`);
    this.io.emit('arrived', { elevatorId: this.id, floor: this.currentFloor });
  }
}

module.exports = Elevator;