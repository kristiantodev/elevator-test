const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

const totalFloors = 50;
const floorHeight = 14;
const elevatorWidth = 10;
const elevatorHeight = 13;

function drawScene(elevators, peopleQueue) {
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
        elevator.draw(ctx);
    });

    // Draw "Waiting" Text for Each Person
    peopleQueue.forEach(person => {
        const yPos = canvas.height - (person.from + 1) * floorHeight + (floorHeight / 2);
        ctx.fillStyle = 'red';
        ctx.fillText('Waiting', 115, yPos);
    });
}
