const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

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
    const travelTime = Math.abs(this.currentFloor - floor) * 1000; // 1 second per floor
    console.log(`Elevator ${this.id}: Moving from floor ${this.currentFloor} to floor ${floor}`);
    this.io.emit('moving', { elevatorId: this.id, from: this.currentFloor, to: floor });
    await new Promise(resolve => setTimeout(resolve, travelTime));
    this.currentFloor = floor;
    console.log(`Elevator ${this.id}: Arrived at floor ${floor}`);
    this.io.emit('arrived', { elevatorId: this.id, floor: this.currentFloor });
  }
}

// Queue class for handling floor requests
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

  // Check if the queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const elevators = [
  new Elevator(io, 1),
  new Elevator(io, 2),
  new Elevator(io, 3)
];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('requestFloor', (floor) => {
       elevators[0].requestFloor(floor);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
