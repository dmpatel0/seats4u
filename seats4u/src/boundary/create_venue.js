import React from 'react'
import { createVenue } from '../controller/controllerVenueManager'
import { useNavigate } from 'react-router-dom';

function createVenueHandler() {

    let venueName = document.getElementById("inp-name").value;
    let numberOfRows = document.getElementById("inp-rows").value;
    let seatsLeft = document.getElementById("inp-s-left").value;
    let seatsCenter = document.getElementById("inp-s-center").value;
    let seatsRight = document.getElementById("inp-s-right").value;

    if(venueName === "" || typeof +numberOfRows !== 'number' || typeof +seatsLeft !== 'number' || typeof +seatsCenter !== 'number' || typeof +seatsRight !== 'number') {
        alert("Please fill out all fields!");
    } else {
        createVenue(venueName, numberOfRows, seatsLeft, seatsCenter, seatsRight);
    }
}

const CreateVenue = () => {

    const navigate = useNavigate();


    return (
        <div class="create-venue">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venues')}}>BACK</button>
            <div class="form">
                <div id="name">
                    <h2>NAME</h2>
                    <input id="inp-name" placeholder="Venue Name"></input>
                </div>
                <div id="numRows">
                    <h2>NUMBER OF ROWS</h2>
                    <input id="inp-rows" placeholder="Number of Rows"></input>
                </div>
                <div id="seatsLeft">
                    <h2>NUMBER OF LEFT SEATS</h2>
                    <input id="inp-s-left" placeholder="Number of Left Seats"></input>
                </div>
                <div id="seatsCenter">
                    <h2>NUMBER OF CENTER SEATS</h2>
                    <input id="inp-s-center" placeholder="Number of Center Seats"></input>
                </div>
                <div id="seatsRight">
                    <h2>NUMBER OF RIGHT SEATS</h2>
                    <input id="inp-s-right" placeholder="Number of Right Seats"></input>
                </div>
                <div id="venuePassword">
                    <h2>VENUE PASSWORD</h2>
                    <label id="label-password">XXXXXXXX</label>
                </div>
                <button id="btn-create-venue" onClick={() => {createVenueHandler()}}>CREATE VENUE</button>
                <p id="api-result"></p>
            </div>
        </div>
    )
}

export default CreateVenue