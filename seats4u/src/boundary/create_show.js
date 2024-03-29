import React, { useEffect } from 'react'
import { createShow } from '../controller/controllerVenueManager'
import { currentVenue } from './venue-view'
import { useNavigate } from 'react-router-dom';

function createShowHandler() {

    let venueName = currentVenue;
    let showName = document.getElementById("inp-showName").value;
    let showDate = document.getElementById("inp-showDate").value;
    let showTime = document.getElementById("inp-showTime").value;
    let singlePrice = document.getElementById("inp-singlePrice").value;

    createShow(venueName, showName, showDate, showTime, singlePrice);
}

const CreateShow = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById("venue-name-label").innerHTML = currentVenue;
    })

    return (
        <div class="create-show">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venue-view')}}>BACK</button>
            <div class="form">
                <div id="venueName">
                    <h2>VENUE NAME</h2>
                    <label id="venue-name-label"></label>
                </div>
                <div id="showName">
                    <h2>SHOW NAME</h2>
                    <input id="inp-showName" placeholder="Show Name"></input>
                </div>
                <div id="showDate">
                    <h2>DATE</h2>
                    <input id="inp-showDate" placeholder="YYYY-MM-DD format"></input>
                </div>
                <div id="showTime">
                    <h2>TIME</h2>
                    <input id="inp-showTime" placeholder="HH:MM:SS in 24 hour clock format"></input>
                </div>
                <div id="singlePrice">
                    <h2>PRICE</h2>
                    <input id="inp-singlePrice" placeholder="Price per seat"></input>
                </div>
                <button id="btn-create-show" onClick={() => {createShowHandler()}}>CREATE SHOW</button>
                <p id="api-result"></p>
            </div>
        </div>
    )
}

export default CreateShow