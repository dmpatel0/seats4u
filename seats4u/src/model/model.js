export class Model {

    constructor() {

        this.isAdmin = false;
        this.selectedSeats = new Map()
        this.blockList = new Map()
        this.totalPrice = 0;
        this.currentShow = -1;

        this.blockIDIter = 0;

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

    addBlock(section, sRow, eRow, price) {

        let block = new Block(section, sRow, eRow, price)

        this.blockList.set(`${this.blockIDIter}`, block);

        this.blockIDIter += 1;
    }

    removeBlock(blockID) {

        this.blockList.delete(blockID)

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

export class Block {

    constructor(section, sRow, eRow, price) {
        this.section = section;
        this.sRow = sRow;
        this.eRow = eRow;
        this.price = price; 
    }
}