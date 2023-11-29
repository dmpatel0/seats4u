import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export let currentVenue;

export function getVenueHandler(venue) {
    currentVenue = venue;
    //document.getElementById('view-container').appendChild(venueLabel);
    //.getElementById("venue-view-name").innerText = currentVenue;
}

const VenueView = () => {

    useEffect(() => {
        document.getElementById("venue-view-name").innerHTML = currentVenue;
    }, []);
    
    //document.getElementById("venue-view-name").innerHTML = venueName;
    const navigate = useNavigate();

    return (
        <div id="view-container" className="venue-view">
            <h1 id="venue-view-name">WPI</h1>
            <button id="create-show" onClick={() => {navigate('/create-show')}}>CREATE SHOW</button>
        </div>
    )
}

export default VenueView