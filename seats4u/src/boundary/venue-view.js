import React from 'react'
import { useNavigate } from 'react-router-dom'

const VenueView = () => {

    const navigate = useNavigate();

    return (
        <div class="venue-view">
            <button id="create-show" onClick={() => {navigate('/create_show')}}>CREATE SHOW</button>
        </div>
    )
}

export default Venue-View