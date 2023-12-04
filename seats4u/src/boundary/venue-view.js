import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listShows } from '../controller/controllerVenueManager';

export let currentVenue;

export function getVenueHandler(venue) {
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

    listShows(currentVenue);
}

const VenueView = () => {

    useEffect(() => {
        document.getElementById("venue-view-name").innerHTML = currentVenue;
    }, []);
    
    //document.getElementById("venue-view-name").innerHTML = venueName;
    const navigate = useNavigate();

    return (
        <div id="view-container" className="venue-view">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venues')}}>BACK</button>
            <h1 id="venue-view-name">WPI</h1>
            <div id="venue-view-buttons">
                    <button id="create-show" onClick={() => {navigate('/create-show')}}>CREATE SHOW</button>
                    <button>DELETE SHOW</button>
                    <button>ACTIVATE SHOW</button>
                    <button>EDIT BLOCKS</button>
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
                        <canvas id="seats-canvas"></canvas>
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