export class Model {

    constructor() {

        this.isAdmin = false;
        this.selectedSeats = new Map()

    }

    authAdmin() {
        this.isAdmin = true;
    }

    selectSeat(row, col) {

        let seat = new Seat(row, col)

        let seatPos = `${seat.row},${seat.col}`

        this.selectedSeats.set(seatPos, seat);
    }

    deselectSeat(row, col) {

        let seatPos = `${row},${col}`
        
        this.selectedSeats.delete(seatPos);
    }
}

export class Seat {

    constructor(row, col, isPurchased) {
        this.row = row;
        this.col = col;
        this.isPurchased = false;
    }

}