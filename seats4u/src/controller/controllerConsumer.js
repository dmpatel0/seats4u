import { redrawCanvas, refreshCanvas } from "../boundary/venue-view"
import { post, get } from "./api"
import { getModel } from "../App"
import { blockColors } from "../boundary/venue-view"

export function getSeats(showID, canvasObj) {

    let resource = '/getSeats'

    let payload = {"showID":showID}

    const handler = (json) => {
        if(json.statusCode === 200) {
            redrawCanvas(json, canvasObj);
        } else {
            console.log(`getSeats Error: ${json.statusCode}`);
        }
    } 

    post(resource, payload, handler)
}

export function selectSeat(showID, row, col) {

    console.log(`Trying to select seat ${row}, ${col} from show: ${showID}`);
    getPrice(showID, row, col)

}

export function deselectSeat(row, col) {

    getModel().deselectSeat(row, col);
    console.log(getModel().selectedSeats);
    listSelectedSeats();
    console.log(`Deselected seat: ${row},${col}`);

}

export function getPrice(showID, row, col) {

    let resource = '/getSeatPrice'

    let payload = {"showID":showID, "rowNum":row, "colNum":col}

    const handler = (json) => {
        if(json.statusCode === 200) {
            getModel().selectSeat(row, col, json.price);
            listSelectedSeats();
        } else {
            console.log(`Error getting price: ${json}`);
        }
    }

    post(resource, payload, handler);
}

export function listSelectedSeats() {

    let parent = document.getElementById("selected-seats-list");
    //console.log(parent)
    let child = parent.lastElementChild;
    //console.log(child);

    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    for(let [key, value] of getModel().selectedSeats) {

        let seat = document.createElement('div'); seat.id = "selected-seat";
        let seatInfo = document.createElement('p'); seatInfo.id = "seatInfo"; seatInfo.innerText = `Seat Position: ${key} --- Seat Price: ${value}`;

        seat.appendChild(seatInfo);

        parent.appendChild(seat);
    }

    document.getElementById("label-num-selected").innerText = getModel().selectedSeats.size
    document.getElementById("label-total-price").innerText = getModel().totalPrice

}

export function purchaseSeats(showID, purchaseData, canvasObj) {

    let resource = '/purchaseSeats'

    let payload = purchaseData;

    const handler = (json) => {
        if(json.statusCode === 200) {
            alert("SEATS PURCHASED!");
            getModel().selectedSeats.clear();
            getModel().totalPrice = 0;
            listSelectedSeats()
            refreshCanvas(canvasObj);
        } else if(json.statusCode === 401) {
            alert(json.error);
        } else {
            console.log(`purchaseSeats error: ${json.error}`);
        }
    }

    post(resource, payload, handler);

}

export function listBlocksConsumer(showID, parentDiv){

    let resource = '/listBlocks';

    let payload = {"showID":showID};

    const handler = (json) => {
        if(json.statusCode === 200){
            console.log("200 LIST BLOCKS");
            console.log(json)
            let blocks = json.blocks;

            for(let i = 0; i < blocks.length; i++){
                console.log("Started for loop");

                let secName = blocks[i].sectionName;
                let bStart = blocks[i].startRow;
                let bEnd = blocks[i].endRow;
                let bPrice = blocks[i].price;
                let bID = blocks[i].blockID;
                let ticketsRemain = blocks[i].ticketsRemaining;
                let ticketsPurchased = blocks[i].ticketsPurchased;

                console.log(secName);
                console.log(bStart);
                console.log(bEnd);
                console.log(bPrice);

                let blockDiv = document.createElement('div');
                blockDiv.className="block-view";

                blockDiv.innerText = `Section: ${secName} - Start Row: ${bStart} - End Row: ${bEnd} - Price: ${bPrice} - Tot. Purchased: ${ticketsPurchased} - Tot. Remain: ${ticketsRemain}`

                //console.log("ELEMENTS APPENDED");

                blockDiv.style.color = blockColors[bID % 10];

                document.getElementById(parentDiv).appendChild(blockDiv);

                console.log("FINAL APPEND");
            }
        }
        else if(json.statusCode === 400){
            // failure
            console.log(400);
        }
    }

    post(resource, payload, handler);
}