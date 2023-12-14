import React, { useEffect } from 'react'
import { listBlocks } from '../controller/controllerVenueManager'
import { currentVenue } from './venue-view'
import { useNavigate } from 'react-router-dom';
import { createBlock } from '../controller/controllerVenueManager';
import { getModel } from '../App';

export let wipBlocks = []; // use json

function listBlocksHandler(){
    // how getting showID
    let showID = getModel().currentShow

    listBlocks(showID); // this function resets wipBlocks
}

function refreshHandler() {

    let parent = document.getElementById("b-list");
    let child = parent.lastElementChild;

    while(child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    let blocks = [];

    for(let [key, value] of getModel().blockList) {
        blocks.push([key, value])
    }

    for(let i = 0; i < blocks.length; i++) {

        let bID = blocks[i][0]
        let secName = blocks[i][1].section
        let bStart = blocks[i][1].sRow
        let bEnd = blocks[i][1].eRow
        let bPrice = blocks[i][1].price

        let blockDiv = document.createElement('div');
        blockDiv.className="block-view";

        blockDiv.innerText = `Block ID: ${bID} - Section: ${secName} - Start Row: ${bStart} - End Row: ${bEnd} - Price: ${bPrice}`

        document.getElementById("b-list").appendChild(blockDiv);
    }
}

function createBlockHandler() {

    let payload = {};
    payload.showID = getModel().currentShow;
    let listOfBlocks = [];
    payload.listOfBlocks = listOfBlocks;

    for(let value of getModel().blockList.values()) {

        let sRow = value.sRow
        let eRow = value.eRow
        let price = value.price
        let sectionName = value.sectionName

        let block = {
            "startRow":sRow,
            "endRow":eRow,
            "price":price,
            "sectionName":sectionName
        }

        payload.listOfBlocks.push(block);
    }

    console.log(payload); 

    createBlock(payload);
}

function addBlockHandler() {

    let sectionName = document.getElementById("inp-sectionID").value;
    let bStartRow = document.getElementById("inp-startRow").value;
    let bEndRow = document.getElementById("inp-endRow").value;
    let bPrice = document.getElementById("inp-price").value;

    getModel().addBlock(sectionName, bStartRow, bEndRow, bPrice);

    refreshHandler();
}

function deleteBlockHandler() {

    let bID = document.getElementById("inp-blockID").value;
    console.log(`delete called for block id: ${bID}`)

    getModel().removeBlock(bID)

    console.log("keys after delete")
    for(let id of getModel().blockList.keys()) {
        console.log(id);
    }

    refreshHandler();
}

const EditBlocks = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById("venue-name-label").innerHTML = currentVenue;
        document.getElementById("show-name-label").innerHTML = getModel().currentShow;
    })

    return (
        <div class="edit-blocks">
            <button id="btn-back-create-venue" class="btn-back" onClick={() => {navigate('/venue-view')}}>BACK</button>
            <h1 id="venue-name-label"></h1>
            <label id="show-name-label"></label>
            <div id="blocks-list">
                <div id="blocks-view-list-div">
                    <h2>CURRENT BLOCKS</h2>
                    <div id="b-list">
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