import React from 'react'
import { createShow } from '.../controller/controllerVenueManager'

function createShowHandler() {

    let showName = document.getElementById("inp-name").value;
    let showDate = document.getElementById("inp-date").value;
    let showTime = document.getElementById("inp-time").value;
    let showPrice = document.getElementById("inp-price").value;

    createShow(showName, showDate, showTime, showPrice);
}

const CreateShow = () => {
    return (
        <div class="create-show">
            <div class="form">
                <div id="name">
                    <h2>NAME</h2>
                    <input id="inp-name" placeholder="Show Name"></input>
                </div>
                <div id="date">
                    <h2>DATE</h2>
                    <input id="inp-rows" placeholder="MM/DD/YYYY date format"></input>
                </div>
                <div id="time">
                    <h2>TIME</h2>
                    <input placeholder="HH:MM in 24 hour clock format"></input>
                </div>
                <div id="price">
                    <h2>PRICE</h2>
                    <input placeholder="Price per seat"></input>
                </div>
                <button id="btn-create-show" onClick={() => {createShowHandler()}}>CREATE SHOW</button>
                <p id="api-result"></p>
            </div>
        </div>
    )
}

export default CreateShow