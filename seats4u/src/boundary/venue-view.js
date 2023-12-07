import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../controller/api';
import { listShows, activateShow, deleteShowVM } from '../controller/controllerVenueManager';
import { deleteShowAdmin } from '../controller/controllerAdmin';
import { getModel } from '../App';
import { Seat } from '../model/model'
import { getSeats } from '../controller/controllerConsumer';

export let currentVenue;

export function getVenueHandler(venue) {
    currentVenue = venue;
}

export function refreshHandler(canvasObj) {

    let parent = document.getElementById("venue-view-show-list");
    console.log(parent)
    let child = parent.lastElementChild;

    let refresh_btn = document.getElementById("venue-view-btn-refresh");
    refresh_btn.disabled = true; console.log("disabled");

    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    let showID = document.getElementById("label-show-id").title.value

    listShows(currentVenue);
    getSeats(showID, canvasObj);

}

export function redrawCanvas(json, canvasObj) {

    const cnv = document.getElementById("seats-canvas")

    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, cnv.clientWidth, cnv.clientHeight);

    let totalRows = json.seats.left.rows;
    let totalColumns = json.seats.left.columns + json.seats.center.columns + json.seats.right.columns;

    let currentCol = 0;

    for(let i = 0; i < 3; i++) {

        let sectionCol;
        
        switch(i) {
            case 0:
                sectionCol = json.seats.left.columns;
                break;
            case 1:
                sectionCol = json.seats.center.columns;
                break;
            case 2:
                sectionCol = json.seats.right.columns;
                break;
            default:
                break;
        }

        console.log(cnv.clientWidth);
        console.log(cnv.clientHeight);

        let seatSize = (cnv.clientWidth / (totalColumns * 10));
        let offset = seatSize * 0.5;

        for (let r = 0; r < totalRows; r++) {
            for (let c = currentCol; c < currentCol+sectionCol; c++) {

                //let seat = new Seat(r, c, json.)

                // HERE is where you draw everything about this cell that you know about...
                ctx.beginPath()
                ctx.rect((seatSize*c)+offset, (seatSize*r)+offset, seatSize, seatSize);
                ctx.fillStyle = "white";
                if((r%2 === 0) || (c%2 === 0)) {
                    ctx.fillStyle = "red"
                }
                ctx.fill()
                ctx.stroke()
            }
        }

        currentCol = currentCol + sectionCol;

        for(let j = 0; j < 5; j++) {

            ctx.beginPath()
            ctx.rect((seatSize*currentCol)+offset, (seatSize*j)+offset, seatSize, seatSize);
            ctx.fillStyle = "transparent"
            ctx.fill()
            //ctx.stroke()
        }
        currentCol += 1; 

    }
    
    
}

function deleteHandler() {

    let sID = prompt("What is the ID of the show you want to delete?");
    
    if(getModel().isAdmin) {
        deleteShowAdmin(sID);
    } else {
        deleteShowVM(sID);   
    }
    
}

function activateHandler() {

    let sID = prompt("What is the ID of the show you want to activate?");

    activateShow(sID);

}

const VenueView = () => {

    const navigate = useNavigate();
    const canvasRef = React.useRef(null);

    useEffect(() => {
        document.getElementById("venue-view-name").innerHTML = currentVenue;
        refreshHandler(canvasRef.current)
    }, []);
    
    //document.getElementById("venue-view-name").innerHTML = venueName;
    

    return (
        <div id="view-container" className="venue-view">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venues')}}>BACK</button>
            <h1 id="venue-view-name">WPI</h1>
            <label id="label-show-id">TEST</label>
            <div id="venue-view-buttons">
                    <button id="create-show-btn" onClick={() => {navigate('/create-show')}}>CREATE SHOW</button>
                    <button id="delete-show-btn" onClick={() => {deleteHandler()}}>DELETE SHOW</button>
                    <button id="activate-show-btn" onClick={() => {activateHandler()}}>ACTIVATE SHOW</button>
                    <button id="edit-blocks-btn" onClick={() => {navigate('/edit-blocks')}}>EDIT BLOCKS</button>
                    <button id="venue-view-btn-refresh" onClick={() => {refreshHandler(canvasRef.current)}}>REFRESH</button>
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
                        <canvas id="seats-canvas" ref={canvasRef}></canvas>
                        <div id="purchase-div"></div>
                    </div>
                </div>
                <div id="block-div">
                        <h2>BLOCKS</h2>
                        <div id="block-list"></div>
                </div>
            </div>
            
        </div>
    )
}

export default VenueView