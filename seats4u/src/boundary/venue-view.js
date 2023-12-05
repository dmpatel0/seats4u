import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../controller/api';
import { listShows, activateShow } from '../controller/controllerVenueManager';
import { deleteShowAdmin } from '../controller/controllerAdmin';

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

function deleteHandler() {

    let sID = prompt("What is the ID of the show you want to delete?");

    deleteShowAdmin(sID);
}

function activateHandler() {

    let sID = prompt("What is the ID of the show you want to activate?");

    activateShow(sID);

}



const VenueView = () => {

    useEffect(() => {
        document.getElementById("venue-view-name").innerHTML = currentVenue;
        refreshHandler()
    }, []);
    
    //document.getElementById("venue-view-name").innerHTML = venueName;
    const navigate = useNavigate();


    return (
        <div id="view-container" className="venue-view">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venues')}}>BACK</button>
            <h1 id="venue-view-name">WPI</h1>
            <label id="label-show-id">TEST</label>
            <div id="venue-view-buttons">
                    <button id="create-show-btn" onClick={() => {navigate('/create-show')}}>CREATE SHOW</button>
                    <button id="delete-show-btn" onClick={() => {deleteHandler()}}>DELETE SHOW</button>
                    <button id="activate-show-btn" onClick={() => {activateHandler()}}>ACTIVATE SHOW</button>
                    <button id="edit-blocks-btn">EDIT BLOCKS</button>
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