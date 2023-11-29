import React from 'react'
import { createShow } from '.../controller/controllerVenueManager'

function createShowHandler() {

    let showName = document.getElementById("inp-showName").value;
    let showDate = document.getElementById("inp-showDate").value;
    let showTime = document.getElementById("inp-showTime").value;
    let singlePrice = document.getElementById("inp-singlePrice").value;

    createShow(showName, showDate, showTime, showPrice);
}

const CreateShow = () => {
    return (
        <div class="create-show">
            <div class="form">
                <div id="showName">
                    <h2>NAME</h2>
                    <input id="inp-showName" placeholder="Show Name"></input>
                </div>
                <div id="showDate">
                    <h2>DATE</h2>
                    <input id="inp-showDate" placeholder="YYYY-MM-DD format"></input>
                </div>
                <div id="showTime">
                    <h2>TIME</h2>
                    <input id="inp-showTime" placeholder="HH-MM:SS in 24 hour clock format"></input>
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