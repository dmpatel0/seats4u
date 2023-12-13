export class Model {

    constructor() {

        this.isAdmin = false;
        this.selectedSeats = new Map()
        this.totalPrice = 0;
        this.currentShow = -1;


    }

    authAdmin() {
        this.isAdmin = true;
    }

    selectSeat(row, col, price) {

        let seatPos = `${row},${col}`

        this.selectedSeats.set(seatPos, price);
        this.totalPrice += price;

    }

    deselectSeat(row, col) {

        let seatPos = `${row},${col}`;
        let seatPrice = this.selectedSeats.get(seatPos);

        this.selectedSeats.delete(seatPos);
        this.totalPrice -= seatPrice;
    }
}

export class Seat {

    constructor(row, col, price) {
        this.row = row;
        this.col = col;
        this.price = price
        this.isPurchased = false;
    }

}