const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

const totalFloors = 50;
const floorHeight = 14;
const elevatorWidth = 10;
const elevatorHeight = 13;
const elevatorCount = 3;

const startTime = new Date();
let finishTime;
document.getElementById("startTime").innerHTML = startTime.toLocaleString();

class Elevator {
  constructor(idx) {
    this.idx = idx;
    this.currentFloor = 0;
    this.previousFloor = 0;
    this.targetFloor = 0;
    this.state = 0;
    this.animationId = null;
    this.positionX = 55 + idx * 15;
  }

  draw() {
    const yPos = canvas.height - (this.currentFloor + 1) * floorHeight + (floorHeight - elevatorHeight);
    ctx.fillStyle = 'red';
    ctx.fillRect(this.positionX, yPos, elevatorWidth, elevatorHeight);
  }

  moveToTargetFloor() {
    if (this.currentFloor < this.targetFloor) {
      this.currentFloor += (this.targetFloor - this.currentFloor) > 5 ? 0.2 : 0.1;
    } else if (this.currentFloor > this.targetFloor) {
      this.currentFloor -= (this.currentFloor - this.targetFloor) > 5 ? 0.2 : 0.1;
    }

    if (Math.abs(this.currentFloor - this.targetFloor) < 0.1) {
      this.currentFloor = this.targetFloor;
      this.state = 0;
    }
  }
}

class Person {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
}

// Global Elevators and People Arrays
const elevators = Array.from({ length: elevatorCount }, (_, idx) => new Elevator(idx));
const peopleQueue = [];
let deliveredCount = 0;
let totalDelivered = 0;
let allPeopleDelivered = false;

// Helper Functions to Manage People and Elevators
function generateRandomPerson() {
  const from = (Math.floor(Math.random() * totalFloors)) + 1;
  let to = (Math.floor(Math.random() * totalFloors)) + 1;
  while (to === from) {
    to = Math.floor(Math.random() * totalFloors);
  }
  peopleQueue.push(new Person(from, to));
}

function assignPersonToElevator() {
  if (allPeopleDelivered) return;

  const person = peopleQueue.shift();
  if (!person) return;

  const availableElevator = elevators.reduce((minElevator, el) =>
    el.state === 0 ? el : minElevator, null);

  if (availableElevator) {
    availableElevator.targetFloor = person.from;
    moveElevator(availableElevator, person);
  }

  updateDeliverCount(1); 
  totalDelivered++;

  if (totalDelivered === 100) {
    returnAllElevatorsToFirstFloor();
    allPeopleDelivered = true;
    finishTime = new Date();
    document.getElementById("finishTime").innerHTML = finishTime.toLocaleString();
    document.getElementById("gapTime").innerHTML = getDateTimeSince(finishTime, startTime);
  }
  
}

function moveElevator(elevator, person) {
  elevator.state = 1;

  const elevatorMoveInterval = setInterval(() => {
    elevator.moveToTargetFloor();
    drawScene();

    if (elevator.state === 0) {
      clearInterval(elevatorMoveInterval);
      moveToDestination(elevator, person);
    }
  }, 50);
}

function moveToDestination(elevator, person) {
  elevator.targetFloor = person.to;
  elevator.state = 1; 

  const elevatorMoveInterval = setInterval(() => {
    elevator.moveToTargetFloor();
    drawScene();
    
    if (elevator.state === 0) {
      clearInterval(elevatorMoveInterval);
      if (totalDelivered === 100) {
        returnAllElevatorsToFirstFloor();
      } else {
        returnElevatorToFirstFloor(elevator);
      }
    }
  }, 50);
}

function returnElevatorToFirstFloor(elevator) {
  elevator.targetFloor = 0;
  elevator.state = 1;
  const elevatorMoveInterval = setInterval(() => {
    elevator.moveToTargetFloor();
    drawScene();

    if (elevator.state === 0) {
      clearInterval(elevatorMoveInterval);
      if (totalDelivered < 100) {
        assignPersonToElevator();
      }
    }
  }, 50);
}

function returnAllElevatorsToFirstFloor() {
  elevators.forEach(elevator => {
    if (elevator.currentFloor !== 0) {
      elevator.targetFloor = 0;
      elevator.state = 1;
      const elevatorMoveInterval = setInterval(() => {
        elevator.moveToTargetFloor();
        drawScene();

        if (elevator.state === 0) {
          clearInterval(elevatorMoveInterval);
        }
      }, 50);
    }
  });
}

// Function to Draw All Elevators and Floors
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw floors
  ctx.fillStyle = 'black';
  for (let i = 0; i < totalFloors; i++) {
    const yPosition = canvas.height - (i + 1) * floorHeight;
    ctx.fillText(`Floor ${i + 1}`, 10, yPosition + floorHeight - 2);
    ctx.beginPath();
    ctx.moveTo(0, yPosition);
    ctx.lineTo(canvas.width, yPosition);
    ctx.stroke();
  }

  // Draw Elevator Dividers
  ctx.beginPath();
  ctx.moveTo(110, 0);
  ctx.lineTo(110, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Elevators
  elevators.forEach(elevator => {
    elevator.draw();
  });

  // Draw "Waiting" Text for Each Person
  peopleQueue.forEach(person => {
    const yPos = canvas.height - (person.from + 1) * floorHeight + (floorHeight / 2);
    ctx.fillStyle = 'red';
    ctx.fillText('Waiting', 115, yPos);
  });
}

// Function to Update the Delivered Count
function updateDeliverCount(count) {
  deliveredCount += count;
  document.getElementById("counter").innerText = deliveredCount;
}

// Simulation of Random Person Requests and Elevator Assignments
function simulate() {
  for (let i = 0; i < 100; i++) {
    generateRandomPerson();
  }
  setInterval(assignPersonToElevator, 2000);
}

simulate();
