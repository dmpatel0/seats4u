import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteVenue, listVenues, getPassword } from '../controller/controllerVenueManager'
import { getVenueHandler } from '../boundary/venue-view'
import { get } from '../controller/api';

function listVenuesHandler() {

    let parent = document.getElementById("venues-data-container");
    let child = parent.lastElementChild;

    let refresh_btn = document.getElementById("btn-refresh");
    refresh_btn.disabled = true;


    setTimeout(() => {
        refresh_btn.disabled = false;
    }, 2500)

    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    listVenues();
    console.log("list venues called");

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

async function manageVenueHandler(navigate) {

    let exists = false;
    let venue = document.getElementById("venue-search-inp").value

    let allVenues = document.getElementById("venues-data-container").children
    for(let i=0; i<allVenues.length; i++) {
        console.log(`venue: ${allVenues[i].title}`)
        if(venue === allVenues[i].title) {
            exists = true;
            break;
        }
    }
    if(exists) {

        getVenueHandler(venue);
        navigate('/venue-view');
        /*let inputPass = prompt("Enter Venue Password");
        let matched = await getPassword(venue, inputPass);

        if(matched) {
            getVenueHandler(venue);
            navigate('/venue-view');  
        } else {
            alert("INCORRECT PASSWORD")
        }*/
    } else {
        alert("VENUE DOES NOT EXIST!");
    }
    
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
    </div>
    */

    return (
        <div className="venues">
            <h1 id="title">VENUES</h1>
            <div className="main-bar">
                <button className="main-bar-btn" onClick={() => {navigate('/create-venue')}}>CREATE</button>
                <button id="btn-refresh" className="main-bar-btn" onClick={() => {listVenuesHandler()}}>REFRESH</button>
                <input id="venue-search-inp" placeholder="Search By Full Or Partial Venue Name"></input>
                <button className="main-bar-btn" onClick={() => {(manageVenueHandler(navigate))}}>MANAGE</button>
                <button className="main-bar-btn" onClick={() => {deleteVenueHandler()}}>DELETE</button>
            </div>
            <div id="venues-data-container">
            </div>
        </div>
    )
}

export default Venues