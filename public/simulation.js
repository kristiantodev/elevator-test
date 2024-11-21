const elevatorCount = 3;
const elevators = Array.from({ length: elevatorCount }, (_, idx) => new Elevator(idx));
const peopleQueue = [];
let deliveredCount = 0;
let totalDelivered = 0;
let allPeopleDelivered = false;

const startTime = new Date();
let finishTime;

function generateRandomPerson() {
    const from = (Math.floor(Math.random() * totalFloors));
    let to = (Math.floor(Math.random() * totalFloors));
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
        drawScene(elevators, peopleQueue);

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
        drawScene(elevators, peopleQueue);

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
        drawScene(elevators, peopleQueue);

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
                drawScene(elevators, peopleQueue);

                if (elevator.state === 0) {
                    clearInterval(elevatorMoveInterval);
                }
            }, 50);
        }
    });
}

function updateDeliverCount(count) {
    deliveredCount += count;
    document.getElementById("counter").innerText = deliveredCount;
}

function simulate() {
    for (let i = 0; i < 100; i++) {
        generateRandomPerson();
    }
    setInterval(assignPersonToElevator, 1800);
}

simulate();
document.getElementById("startTime").innerHTML = startTime.toLocaleString();