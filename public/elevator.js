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

    draw(ctx) {
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
