import React from 'react'
import { createVenue, getPassword } from '../controller/controllerVenueManager'
import { post, get } from "../controller/api"

function createVenueHandler() {

    let venueName = document.getElementById("inp-name").value;
    let numberOfRows = document.getElementById("inp-rows").value;

    let resource = '/createVenue'

    let venuePass = Math.random().toString(36).substring(2,70);
    document.getElementById("venuePassword").value = venuePass

    console.log(venuePass);
    console.log(venueName);
    console.log(numberOfRows);

    let payload = {"venueName":venueName, "numRows":numberOfRows, "password":venuePass}

    const handler = (json) => {
        document.getElementById("api-result").value = json.body
    }

    post(resource, payload, handler)
    
}

const CreateVenue = () => {
    return (
        <div class="create-venue">
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
                    <input placeholder="Number of Left Seats"></input>
                </div>
                <div id="seatsCenter">
                    <h2>NUMBER OF CENTER SEATS</h2>
                    <input placeholder="Number of Center Seats"></input>
                </div>
                <div id="seatsRight">
                    <h2>NUMBER OF RIGHT SEATS</h2>
                    <input placeholder="Number of Right Seats"></input>
                </div>
                <div id="venuePassword">
                    <h2>VENUE PASSWORD</h2>
                    <label>XXXXXXXX</label>
                </div>
                <button id="btn-check-pass" onClick={() => {getPassword(document.getElementById("inp-name").value)}}>GET PASSWORD</button>
                <button id="btn-create-venue" onClick={() => {createVenueHandler()}}>CREATE VENUE</button>
                <p id="api-result"></p>
            </div>
        </div>
    )
}

export default CreateVenue