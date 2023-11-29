import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteVenue, listVenues } from '../controller/controllerVenueManager'

function listVenuesHandler() {

    let parent = document.getElementById("venues-data-container");
    let child = parent.lastElementChild;
    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    listVenues();
    console.log("listVenues Called");

}

function deleteVenueHandler() {

    console.log("delete called")
    //let parentVenue = this.parentElement.parentElement.title
    let venueName = document.getElementById("venue-search-inp").value
    
    async function refreshVenues() {
        await deleteVenue(venueName);
        listVenuesHandler();
        console.log("DELETE");
    }

    refreshVenues();
}

const Venues = () => {

    useEffect(() => {
        listVenuesHandler();
    }, []);

    const navigate = useNavigate()

    // Add checks to the model to determine if user is an admin or not

    /* VENUE HTML FORMAT 
    <div class="venue">
        <div class="info-container">
            <h3>VENUE NAME HERE</h3>
            <div class="show-list">
                <div class="show">
                    <p>SHOW</p>
                    <p>01/01/2001</p>
                </div>
            </div>
        </div>
        <div class="btn-container">
            <button>MANAGE</button>
            <button>DELETE</button>
        </div>
    </div>
    */

    return (
        <div className="venues">
            <h1 id="title">VENUES</h1>
            <div className="main-bar">
                <button className="main-bar-btn" onClick={() => {navigate('/create-venue')}}>CREATE</button>
                <button className="main-bar-btn" onClick={() => {listVenuesHandler()}}>REFRESH</button>
                <input id="venue-search-inp" placeholder="Search By Full Or Partial Venue Name"></input>
                <button className="main-bar-btn" onClick={() => {}}>MANAGE</button>
                <button className="main-bar-btn" onClick={() => {deleteVenueHandler()}}>DELETE</button>
            </div>
            <div id="venues-data-container">
            </div>
        </div>
    )
}

export default Venues