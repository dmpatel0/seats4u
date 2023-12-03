import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteVenue, listVenues, getPassword } from '../controller/controllerVenueManager'
import { getVenueHandler } from '../boundary/venue-view'
import { get } from '../controller/api';

async function listVenuesHandler() {

    let parent = document.getElementById("venues-data-container");
    let child = parent.lastElementChild;

    let refresh_btn = document.getElementById("btn-refresh");
    refresh_btn.disabled = true;

    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    let sCode = await listVenues();
    console.log(sCode)
    refresh_btn.disabled = false;
    
}

async function deleteVenueHandler() {

    console.log("delete called")
    let exists = false;
    let venueName = document.getElementById("venue-search-inp").value
    
    let allVenues = document.getElementById("venues-data-container").children
    for(let i=0; i<allVenues.length; i++) {
        if(venueName === allVenues[i].title) {
            exists = true;
            break;
        }
    }
    if(exists) {
        let sCode = await deleteVenue(venueName);
        listVenuesHandler();
    } else {
        alert("VENUE DOES NOT EXIST!");
    }
    
    
}

async function manageVenueHandler(navigate) {

    let exists = false;
    let venue = document.getElementById("venue-search-inp").value

    let allVenues = document.getElementById("venues-data-container").children
    for(let i=0; i<allVenues.length; i++) {
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