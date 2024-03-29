import React, { useEffect } from 'react'
import { generateShowReport } from '../controller/controllerVenueManager'
import { useNavigate } from 'react-router-dom';
import { currentVenue } from '../boundary/venue-view';

const ShowReport = () => {
    
    useEffect(() => {
        generateShowReport(currentVenue)
        console.log(currentVenue);
    }, []);

    const navigate = useNavigate()

    return (
        <div class="show-report">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venue-view')}}>BACK</button>
            <div class="form">
                <div id="show-report-container">
                </div>
            </div>
        </div>
    )
}

export default ShowReport