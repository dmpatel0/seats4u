import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listActiveShows } from '../controller/controllerVenueManager';
import { getModel } from '../App';
import { blockColors } from './venue-view';
import { getSeats, selectSeat, deselectSeat, purchaseSeats, listBlocksConsumer } from '../controller/controllerConsumer';

export let currentVenue;

export function getVenueHandlerConsumer(venue) {
    currentVenue = venue;
}

export function refreshHandler() {

    let parent = document.getElementById("venue-view-show-list");
    console.log(parent)
    let child = parent.lastElementChild;

    let refresh_btn = document.getElementById("venue-view-btn-refresh");
    refresh_btn.disabled = true; console.log("disabled");

    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    listActiveShows(currentVenue);

}

export function refreshCanvas(canvasObj) {

    let showID = document.getElementById("label-show-id").title;
    console.log(showID);

    getSeats(showID, canvasObj);
}

export function redrawCanvas(json, canvasObj) {

    const cnv = document.getElementById("seats-canvas")

    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, cnv.clientWidth, cnv.clientHeight);

    let totalRows = json.seats.left.rows;
    let totalColumns = json.seats.left.columns + json.seats.center.columns + json.seats.right.columns;

    let currentCol = 0;
    let sectionCol;


    for(let i = 0; i < 3; i++) {

        switch(i) {
            case 0:
                sectionCol = json.seats.left.columns;
                console.log(sectionCol);
                break;
            case 1:
                sectionCol = json.seats.center.columns;
                console.log(sectionCol);

                break;
            case 2:
                sectionCol = json.seats.right.columns;
                console.log(sectionCol);

                break;
            default:
                break;
        }

        console.log(cnv.clientWidth);
        console.log(cnv.clientHeight);

        let seatSize = (cnv.clientWidth / ((totalColumns+4)+ 2*(totalColumns+4)));
        let offset = 5;

        for (let r = 0; r < totalRows; r++) {
            for (let c = currentCol; c < currentCol+sectionCol; c++) {

                //let seat = new Seat(r, c, json.)
                // HERE is where you draw everything about this cell that you know about...
                ctx.beginPath()
                ctx.rect((seatSize*c)+offset, (seatSize*r)+offset, seatSize-offset, seatSize-offset);

                let index = (r * totalColumns) + c

                if(json.seats.seats[index].isPurchased === 1) {
                    ctx.fillStyle = "black";
                } else {
                    ctx.fillStyle = blockColors[(json.seats.seats[index].blockID) % 10]
                }
                
                ctx.fill()
                ctx.stroke()
            }

            //console.log(`end DRAW row: ${r}`);

        }

        currentCol = currentCol + sectionCol; 

    }
    
    
}

function purchaseHandler(canvasObj) {

    let showID = document.getElementById("label-show-id").title;
    let payload = {}
    let seats = []
    payload.showID = showID;
    payload.seats = seats;

    for(let key of getModel().selectedSeats.keys()) {
        let seatPos = key.split(",");
        let rNum = seatPos[0];
        let cNum = seatPos[1];
        let seat = {
            "rowNum":rNum,
            "colNum":cNum
        }

        payload.seats.push(seat)
    }

    purchaseSeats(showID, payload, canvasObj);
    
}

function selectHandler(action) {

    let showID = document.getElementById("label-show-id").title;
    let row = document.getElementById("inp-select-row").value;
    let col = document.getElementById("inp-select-col").value;

    if(action === "select") {
        selectSeat(showID, row, col);
    } else if(action === "deselect") {
        deselectSeat(row, col);
    }

}

export function listBlocksHandlerConsumer() {

    let parent = document.getElementById("block-list")
    let child = parent.lastElementChild;
    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    let parentDivID = "block-list"
    let showID = getModel().currentShow;
    
    listBlocksConsumer(showID, parentDivID)

}

const VenueViewConsumer = () => {

    const navigate = useNavigate();
    const canvasRef = React.useRef(null);

    useEffect(() => {
        document.getElementById("venue-view-name").innerHTML = currentVenue;
        refreshHandler(canvasRef.current)
    }, []);

    return (
        <div id="view-container" className="venue-view">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venues')}}>BACK</button>
            <button id="btn-logout" class="btn-logout" onClick={() => {getModel().isAdmin = false; navigate('/')}}>LOGOUT</button>
            <h1 id="venue-view-name">WPI</h1>
            <label id="label-show-id">TEST</label>
            <div id="venue-view-buttons">
                    <button id="list-blocks-btn" onClick={() => {listBlocksHandlerConsumer()}}>LIST BLOCKS</button>
                    <button id="refresh-canvas-btn" onClick={() => {refreshCanvas(canvasRef.current)}}>LOAD SEATS</button>
                    <button id="venue-view-btn-refresh" onClick={() => {refreshHandler()}}>REFRESH</button>
            </div>
            <div id="venue-view-content">
                <div id="venue-view-show-div">
                    <h2>CURRENT SHOWS</h2>
                    <div id="venue-view-show-list">
                        <div></div>
                    </div>
                </div>
                <div id="seats-view">
                    <div id="seats-div">
                        <h2>SEATS</h2>
                        <div id="select-bar">
                            <input id="inp-select-row" placeholder="ROW"></input>
                            <input id="inp-select-col" placeholder="COLUMN"></input>
                            <button id="select-seat-btn" onClick={() => {selectHandler("select")}}>SELECT</button>
                            <button id="deselect-seat-btn" onClick={() => {selectHandler("deselect")}}>DESELECT</button>
                        </div>
                        <canvas id="seats-canvas" ref={canvasRef}></canvas>
                        <div id="purchase-div">
                            <div id="div-num-selected">
                                <p>Number of Seats: </p>
                                <p id="label-num-selected"></p>
                            </div>
                            <div id="div-total-price">
                                <p>Total Price: </p>
                                <p id="label-total-price"></p>
                            </div>
                            <button id="purchase-btn" onClick={() => {purchaseHandler(canvasRef.current)}}>PURCHASE</button>
                        </div>
                    </div>
                </div>
                <div id="block-div">
                        <h2>BLOCKS</h2>
                        <div id="block-list"></div>
                        <h2>SELECTED SEATS</h2>
                        <div id="selected-seats-list"></div>
                </div>
            </div>
            
        </div>
    )
}

export default VenueViewConsumer