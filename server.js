const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Elevator = require('./elevator');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const elevator = new Elevator(io);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('requestFloor', (floor) => {
    elevator.requestFloor(floor);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
