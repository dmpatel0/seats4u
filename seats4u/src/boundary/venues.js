import React from 'react'
import { useNavigate } from 'react-router-dom'

const Venues = () => {

    const navigate = useNavigate()

    // Add checks to the model to determine if user is an admin or not

    return (
        <div class="venues">
            <h1 id="title">VENUES</h1>
            <div class="main-bar">
                <button class="main-bar-btn" onClick={() => {navigate('/create-venue')}}>CREATE</button>
                <input id="venue-search-inp"placeholder="Search By Full Or Partial Venue Name"></input>
                <button class="main-bar-btn">REFRESH</button>
            </div>
            <div id="data-container">
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
            </div>
        </div>
    )
}

export default Venues