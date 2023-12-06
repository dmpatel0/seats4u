import React, { useEffect } from 'react'
import { addBlock } from '../controller/controllerVenueManager'
import { currentVenue } from './venue-view'
import { currentShow } from './venue-view'
import { useNavigate } from 'react-router-dom';

function addBlockHandler() {
    // Backend names: blockID, showID, sectionID, startRow, endRow, price

    let blockID = document.getElementById("inp-blockID").value;
    let showID = document.getElementById("inp-showID").value;
    let sectionID = document.getElementById("inp-sectionID").value;
    let blockStartRow = document.getElementById("inp-startRow").value;
    let blockEndRow = document.getElementById("inp-endRow").value;
    let blockPrice = document.getElementById("inp-price").value;

    addBlock(blockID, showID, sectionID, blockStartRow, blockEndRow, blockPrice);
}

const EditBlocks = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById("venue-name-label").innerHTML = currentVenue;
    })

    return (
        <div id="view-container" className="venue-view">
        <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venue-view')}}>BACK</button>
        <h1 id="venue-view-name">WPI</h1>
        <label id="label-show-id">TEST</label>
        <div id="blocks-list">
            <div id="blocks-view-list-div">
                <h2>CURRENT BLOCKS</h2>
                <div id="blocks-view-list-div">
                    <div></div>
                </div>
            </div>
        </div>
        <div id="add-block">
            <div id="venueName">
                <h2>VENUE NAME</h2>
                <label id="venue-name-label"></label>
            </div>
            <div id="sectionID">
                <h2>SECTION</h2>
                <input id="inp-sectionID" placeholder="Section"></input>
            </div>
            <div id="startRow">
                <h2>START ROW</h2>
                <input id="inp-startRow" placeholder="Starting Row"></input>
            </div>
            <div id="endRow">
                <h2>END ROW</h2>
                <input id="inp-endRow" placeholder="Ending Row"></input>
            </div>
            <div id="blockPrice">
                <h2>PRICE</h2>
                <input id="inp-price" placeholder="Price within block"></input>
            </div>
            <button id="btn-add-block" onClick={() => {addBlockHandler()}}>ADD</button>
            <p id="api-result"></p>
        </div>        
    </div>
    )
}

export default EditBlocks