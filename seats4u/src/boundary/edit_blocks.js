import React, { useEffect } from 'react'
import { listBlocks } from '../controller/controllerVenueManager'
import { currentVenue } from './venue-view'
import { useNavigate } from 'react-router-dom';
import { getModel } from '../App';

export let wipBlocks; // use json

function listBlocksHandler(){
    // how getting showID
    let showID = getModel().currentShow

    listBlocks(showID); // this function resets wipBlocks
}

function refreshHandler(){
    let parent = document.getElementById("blocks-view-list-div");
    let child = parent.lastElementChild;

    while(child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    let blocks = wipBlocks;
    for(let i = 0; i < blocks.length; i++){
        let bID = blocks[i].blockID;
        let secID = blocks[i].sectionID;
        let bStart = blocks[i].blockStartRow;
        let bEnd = blocks[i].blockEndRow;
        let bPrice = blocks[i].blockPrice;

        let blockDiv = document.createElement('div');
        blockDiv.className="block-view";

        let blockID = document.createElement('p'); blockID.id="blockID"; blockID.innerText = bID; 

        let sectionID = document.createElement('p'); sectionID.id="sectionID"; sectionID.innerText = secID; 

        let startRow = document.createElement('p'); startRow.id="startRow"; startRow.innerText = bStart; 
        
        let endRow = document.createElement('p'); endRow.id="endRow"; endRow.innerText = bEnd; 

        let blockPrice = document.createElement('p'); blockPrice.id="blockPrice"; blockPrice.innerText = bPrice; 

        blockDiv.appendChild(blockID);
        blockDiv.appendChild(sectionID);
        blockDiv.appendChild(startRow);
        blockDiv.appendChild(endRow);
        blockDiv.appendChild(blockPrice);

        document.getElementById("blocks-view-list-div").appendChild(blockDiv);
    }
}

function createBlockHandler(){
    createBlock(wipBlocks);
}

function addBlockHandler(){
    let blockID = 10; // make new id
    let showID = getModel().currentShow
    let sectionID = document.getElementById("inp-sectionID").value;
    let bStartRow = document.getElementById("inp-startRow").value;
    let bEndRow = document.getElementById("inp-endRow").value;
    let bPrice = document.getElementById("inp-price").value;

    wipBlocks.push({"blockID":blockID, "showID":showID, "sectionID":sectionID, "blockStartRow":bStartRow, "blockEndRow":bEndRow, "blockPrice":bPrice});

    refreshHandler();
}

function deleteBlockHandler(){
    let bID = document.getElementById("inp-blockID").value;

    // remove from wipBlocks
    for(let i = 0; i < wipBlocks.length; i++){
        if(wipBlocks[i].blockID == bID){
            delete wipBlocks[i];
            break;
        }
    }

    refreshHandler();
}

const EditBlocks = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById("venue-name-label").innerHTML = currentVenue;
        document.getElementById("show-name-label").innerHTML = 10;
    })

    return (
        <div class="edit-blocks">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venue-view')}}>BACK</button>
            <h1 id="venue-name-label"></h1>
            <label id="show-name-label"></label>
            <div id="blocks-list">
                <div id="blocks-view-list-div">
                    <h2>CURRENT BLOCKS</h2>
                    <div id="blocks-view-list-div">
                        <div></div>
                    </div>
                </div>
                <button id="btn-create-block" onClick={() => {createBlockHandler()}}>CREATE</button>
                <p id="api-result"></p>
                <button id="btn-reset-blocks" onClick={() => {listBlocksHandler()}}>UNDO CHANGES</button>
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
            </div>
            <div id="delete-block">
                <div id="blockID">
                    <h2>BLOCK ID</h2>
                    <input id="inp-blockID" placeholder="Block ID Number"></input>
                </div>
                <button id="btn-delete-block" onClick={() => {deleteBlockHandler()}}>DELETE</button>
            </div>        
        </div>
    )
}

export default EditBlocks