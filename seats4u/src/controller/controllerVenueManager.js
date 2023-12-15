import { useNavigate } from "react-router-dom";
import { post, get } from "./api"
import { listVenuesHandler } from "../boundary/venues";
import { getVenueHandler, refreshHandler, blockColors } from "../boundary/venue-view";
import { getModel } from "../App";
import { listSelectedSeats } from "./controllerConsumer";
import { getVenueHandlerConsumer } from "../boundary/venue-view-consumer";

function createInitialSections(venueName, seatsLeft, seatsCenter, seatsRight) {

    console.log(typeof seatsLeft);

    let resource = '/createInitialSections'

    let payload = {
        "venueName":venueName,
        "sections": [
            {
                "numOfCol":+seatsLeft,
                "sectionName":"left"
            },
            {
                "numOfCol":+seatsRight,
                "sectionName":"right"
            },
            {
                "numOfCol":+seatsCenter,
                "sectionName":"center"
            }
        ]
    }

    const handler = (json) => {
        if(json.statusCode === 200) {
            console.log("initial sections created");
        } else {
            console.log(`Error creating sections: ${json.error}`);
        }
    }

    post(resource, payload, handler);

}

export function createVenue(venueName, numRows, seatsLeft, seatsCenter, seatsRight) {

    let name = venueName;
    let nRows = numRows;
    let sLeft = seatsLeft;
    let sCenter = seatsCenter;
    let sRight = seatsRight; 

    let resource = '/createVenue'

    let venuePass = Math.random().toString(36).substring(2,70);

    console.log(venuePass);

    console.log(name);
    console.log(nRows);
    let payload = {"venueName":name, "numRows":numRows, "password":venuePass}

    const handler = (json) => {
        document.getElementById("api-result").innerHTML = json.statusCode
        if(json.statusCode === 200) {
            document.getElementById("label-password").innerHTML = venuePass
            document.getElementById("api-result").innerHTML = "VENUE CREATED";
            createInitialSections(venueName, sLeft, sCenter, sRight)
        } else {
            document.getElementById("label-password").innerHTML = "XXXXXXXX"
            document.getElementById("api-result").innerHTML = json.error.sqlMessage;
        }
    }

    post(resource, payload, handler);
}

function createInitialBlock(venueName, showName, showDate, showTime) {

    let showDateTime = `${showDate} ${showTime}`;
    
    let resource = '/createInitialBlocks';

    let payload = {"venueName":venueName, "showName":showName, "showTime":showDateTime};

    const handler = (json) => {
        if(json.statusCode === 200) {
            console.log(`Inital blocks for ${showName} created...`)
            createInitialSeats(venueName, showName, showDateTime);
        } else {
            console.log(`Error: ${json.error}`);
        }
    }

    post(resource, payload, handler);

}

function createInitialSeats(venueName, showName, showDateTime) {

    let resource = '/createInitialSeats'

    let payload = {"venueName":venueName, "showName":showName, "showTime":showDateTime};

    const handler = (json) => {
        if(json.statusCode === 200) {
            console.log(`Initial seats for ${showName} created...`);
        } else {
            console.log(`Error: ${json.error}`);
        }
    }

    post(resource, payload, handler);
}

export function createShow(venueName, showName, showDate, showTime, singlePrice) {
    
    let vName = venueName;
    let sName = showName;
    let date = showDate;
    let time = showTime;
    let price = singlePrice;

    let resource = '/createShow'

    console.log(vName);
    console.log(sName);
    console.log(date);
    console.log(time);
    console.log(price);

    let payload = {"venueName":vName, "showName":sName, "showTime":date+" "+time, "price":price}

    const handler = (json) => {
        document.getElementById("api-result").innerHTML = json.statusCode
        if(json.statusCode === 200) {
            console.log(`Show ${showName} created...`)
           createInitialBlock(venueName, showName, showDate, showTime);
        } else {
            console.log(`Error creating show: ${json.error}`);
        }
    }

    post(resource, payload, handler);
}

export function activateShow(showID) {

    let resource = '/activateShow';

    let payload = {"showID":showID}

    const handler = (json) => {
        if(json.statusCode === 200) {
            alert("Show activated.");
            refreshHandler();
        } else if(json.statusCode === 404) {
            alert("Show is already active!");
        } else {
            alert(`Error: ${json.error}`);
        }
    }

    post(resource, payload, handler);

}

export function checkBlocks(showID) {
    
    let resource = '/checkBlocks'

    let payload = {"showID":showID}

    const handler = (json) => {
        if(json.statusCode === 200) {
            activateShow(showID);
        } else {
            alert("Error: Either blocks overlap or seats are not assigned to a block, please remake blocks and create again before activating...")
        }
    }

    post(resource, payload, handler)

}

export function listVenues(navigate) {

    function venueHTML() {

        let venueDiv = document.createElement('div'); venueDiv.className="venue";

        let infoDiv = document.createElement('div'); infoDiv.className="info-container";
        venueDiv.appendChild(infoDiv);

        let venueNameLabel = document.createElement('h3'); venueNameLabel.id="venueNameLabel";
        venueNameLabel.onclick = (() => {getVenueHandlerConsumer(venueNameLabel.innerHTML); navigate('/venue-view-consumer');})
        infoDiv.appendChild(venueNameLabel);

        let showsDiv = document.createElement('div'); showsDiv.className="show-list";
        infoDiv.appendChild(showsDiv);

        return venueDiv;
    }

    get('/listVenuesAdmin')
    .then(function (response) {
        
        if(response.statusCode === 200) {
            let venueContainer = document.getElementById("venues-data-container");
            let venues = response.venues;

            for(let i=0; i<venues.length; i++) {
                let venueDiv = venueHTML();
                let venueNameLabel = venueDiv.firstChild.firstChild; venueNameLabel.innerHTML=venues[i].venueName;

                /* REMOVE JUST FOR TESTING */

                const passHandler= (json) => {
                    if(json.statusCode === 200) {
                        console.log(`Venue: ${venues[i].venueName} -- Password: ${json.password}`);
                    } else {
                        console.log(`Venue: ${venues[i].venueName} -- ERROR`);
                    }
                }

                post('/getPassword', {"venueName":venues[i].venueName}, passHandler)


                /* END REMOVE */

                venueDiv.title = venues[i].venueName;
                
                let payload = {"venueName":venues[i].venueName};

                const handler = (json) => {
                    if(json.statusCode === 200) {

                        let shows = json.shows

                        for(let j=0; j<shows.length; j++) {
                            let sName = shows[j].showName;
                            let sDateTime = shows[j].showTime;
                            sDateTime = sDateTime.replace('T', " --- ");
                            sDateTime = sDateTime.replace('Z', "");
                            sDateTime = sDateTime.substring(0, 20);


                            let show = document.createElement('div'); show.className="show";
                            let showName = document.createElement('p'); showName.id="showName"; showName.innerText = sName;
                            let showDateTime = document.createElement('p'); showDateTime.id="showDate"; showDateTime.innerText = sDateTime;
                            show.appendChild(showName); show.appendChild(showDateTime);

                            venueDiv.firstChild.lastChild.appendChild(show)          
                        }

                    } else {
                        console.log(json.error)
                    }
                }
                
                post('/listActiveShows', payload, handler)

                venueContainer.appendChild(venueDiv);
            }
        }
    })
    .then(() => {
        let refresh_btn = document.getElementById("btn-refresh")
        refresh_btn.disabled = false;
    })

}

export function listActiveShows(venueName) {
    
    let payload = {"venueName":venueName};

    const handler = (json) => {
        if(json.statusCode === 200) {
            let shows = json.shows

            for(let i = 0; i<shows.length; i++) {

                let sName = shows[i].showName;

                let sDateTime = shows[i].showTime;
                sDateTime = sDateTime.replace('T', " --- ");
                sDateTime = sDateTime.replace('Z', "");
                sDateTime = sDateTime.substring(0, 20);

                let sID = shows[i].showID;
                
                let show = document.createElement('div'); show.className="show-venue-view";

                show.onclick=(() => {
                    document.getElementById("label-show-id").innerText = `Current Show Name: ${show.lastElementChild.innerText} || Show ID: ${show.firstElementChild.innerText}`
                    document.getElementById("label-show-id").title = sID;
                    getModel().currentShow = show.firstElementChild.innerText
                    getModel().selectedSeats.clear();
                    getModel().totalPrice = 0;
                    listSelectedSeats();
                });

                let showID = document.createElement('p'); showID.id="showID"; showID.innerText = sID;
                let showName = document.createElement('p'); showName.id="showName"; showName.innerText=`${sName}\n${sDateTime}`; 

                show.appendChild(showID); show.appendChild(showName);

                if(shows[i].isSoldOut === true) {
                    console.log("SHOW IS SOLD OUT")
                    show.style.backgroundColor = "#ff4f4f"
                }

                document.getElementById("venue-view-show-list").appendChild(show);
            }
            
            document.getElementById("venue-view-btn-refresh").disabled = false;
        }
    }

    post('/listActiveShows', payload, handler);
    
    document.getElementById("label-show-id").innerText = "NO SHOW SELECTED"

}

export function listShows(venueName) {
    
    let payload = {"venueName":venueName};

    const handler = (json) => {
        if(json.statusCode === 200) {
            let shows = json.shows

            for(let i = 0; i<shows.length; i++) {

                let sName = shows[i].showName;

                let sDateTime = shows[i].showTime;
                sDateTime = sDateTime.replace('T', " --- ");
                sDateTime = sDateTime.replace('Z', "");
                sDateTime = sDateTime.substring(0, 20);

                let sID = shows[i].showID;
                
                let show = document.createElement('div'); show.className="show-venue-view";

                show.onclick=(() => {
                    document.getElementById("label-show-id").innerText = `Current Show Name: ${show.lastElementChild.innerText} || Show ID: ${show.firstElementChild.innerText}`
                    document.getElementById("label-show-id").title = sID;
                    getModel().currentShow = show.firstElementChild.innerText
                    getModel().selectedSeats.clear();
                    getModel().totalPrice = 0;
                    listSelectedSeats();
                });

                let showID = document.createElement('p'); showID.id="showID"; showID.innerText = sID;
                let showName = document.createElement('p'); showName.id="showName"; showName.innerText=`${sName}\n${sDateTime}`; 

                show.appendChild(showID); show.appendChild(showName);

                document.getElementById("venue-view-show-list").appendChild(show);
            }
            
            document.getElementById("venue-view-btn-refresh").disabled = false;
        }
    }

    post('/listShows', payload, handler);
    
    document.getElementById("label-show-id").innerText = "NO SHOW SELECTED"

}

export function deleteVenue(venueName) {

    let name = venueName;
    let resource = '/deleteVenue';

    let payload = {"venueName":name};

    const handler = (json) => {
        if(json.statusCode === 200) {
            console.log("delete successful");
            listVenuesHandler()
        } else {
            console.log(`error: ${json.error}`)
        }
    }

    post(resource, payload, handler)
}

export function listBlocks(showID, parentDiv){

    let resource = '/listBlocks';

    let payload = {"showID":showID};

    const handler = (json) => {
        if(json.statusCode === 200){
            console.log("200 LIST BLOCKS");

            console.log(json);
            let blocks = json.blocks;

            for(let i = 0; i < blocks.length; i++){
                console.log("Started for loop");

                let secName = blocks[i].sectionName;
                let bStart = blocks[i].startRow;
                let bEnd = blocks[i].endRow;
                let bPrice = blocks[i].price;
                let bID = blocks[i].blockID;
                let ticketsRemain = blocks[i].ticketsRemaining;
                let ticketsPurchased = blocks[i].ticketsPurchased;

                console.log(secName);
                console.log(bStart);
                console.log(bEnd);
                console.log(bPrice);

                let blockDiv = document.createElement('div');
                blockDiv.className="block-view";

                blockDiv.innerText = `Section: ${secName} - Start Row: ${bStart} - End Row: ${bEnd} - Price: ${bPrice} - Tot. Purchased: ${ticketsPurchased} - Tot. Remain: ${ticketsRemain}`

                //console.log("ELEMENTS APPENDED");

                blockDiv.style.color = blockColors[bID % 10];

                document.getElementById(parentDiv).appendChild(blockDiv);

                console.log("FINAL APPEND");
            }
        }
        else if(json.statusCode === 400){
            // failure
            console.log(400);
        }
    }

    post(resource, payload, handler);
}

export function createBlock(payload){

    let resource = '/createBlocks';

    const handler = (json) => {
        document.getElementById("api-result").innerHTML = json.statusCode
        if(json.statusCode === 200){
            console.log("BLOCKS CREATED")
            console.log(`Calling update seats for show: ${payload.showID}`)
            updateSeats(payload.showID)
        }
        else if(json.statusCode === 400){
            console.log("ERROR CREATING NEW BLOCKS")
            console.log(json)
        }
    }

    post(resource, payload, handler);
}

function updateSeats(showID) {

    let resource = '/updateSeats'

    let payload = {"showID":showID}

    const handler = (json) => {
        if(json.statusCode === 200) {
            console.log("Seat blocks updated!")
        } else {
            console.log(`Error updating seats: ${json}`)
            alert("Blocks are overlapping or seats are not assigned to a black, please remake configuration and try again");
        }
    }

    post(resource, payload, handler)

}

export function checkPassword(venueName, userPass, navFunc, action) {

    let resource = '/getPassword';

    let payload = {"venueName":venueName};

    const handler = (json) => {
        if(json.statusCode === 200) {
            if(userPass === json.password) {
                alert("PASSWORD MATCHED");
                if(action === "manage") {
                    getVenueHandler(venueName);
                    navFunc('/venue-view');
                } else if(action === "delete") {
                    deleteVenue(venueName);
                }
            } else {
                alert("INCORRECT PASSWORD");
            }
        } else {
            console.log(json.error)
        }
    }

    post(resource, payload, handler);

}

export function deleteShowVM(showID) {

    let resource = '/deleteShowVM';
    let payload = {"showID":showID};

    const handler = (json) => {
        if(json.statusCode === 200) {
            alert("Show Deleted");
            refreshHandler();
        } else if(json.statusCode === 401){
            alert(`Show is active and can't be deleted!`)
        } else {
            alert("Error")
            console.log(`Error deleting show: ${json.error}`);
        }
    }

    post(resource, payload, handler);
}

export function generateShowReport(currentVenue) {

    function reportHTML(currentVenue) {

        let venueDiv = document.createElement('div'); venueDiv.className="venue-sr";

        let infoDiv = document.createElement('div'); infoDiv.className="info-container-sr";
        
        let venueNameLabel = document.createElement('h3'); venueNameLabel.id="venueNameLabel"; venueNameLabel.innerHTML = currentVenue;
        infoDiv.appendChild(venueNameLabel);

        let showsDiv = document.createElement('div'); showsDiv.className="show-list-sr";
        infoDiv.appendChild(showsDiv);

        venueDiv.appendChild(infoDiv);

        return venueDiv;
    }

    let payload = {"venueName":currentVenue};

    const handler = (json) => {
        if(json.statusCode === 200){

            let grandTotalProfit = 0;
            let grandTotalTicketsSold = 0;

            let venueContainer = document.getElementById("show-report-container");

            let report = json.report;

            let reportDiv = reportHTML(currentVenue);

            for(let i=0; i<report.length; i++) { 
                let sID = report[i].showID; console.log(sID);
                let sName = report[i].showName; console.log(sName);
                let sTime = report[i].showTime; console.log(sTime);
                let sActive = report[i].isActive; console.log(sActive);
                let sTicketsPurchased = report[i].ticketsPurchased; console.log(sTicketsPurchased);
                let sTicketsRemaining = report[i].ticketsRemaining; console.log(sTicketsRemaining);
                let sProfit = report[i].totalProfit; console.log(sProfit);

                grandTotalProfit += sProfit;
                grandTotalTicketsSold += sTicketsPurchased;

                let show = document.createElement('div'); show.className="show-sr";
                let showID = document.createElement('p'); showID.id="showID"; showID.innerText = `Show ID: ${sID}\n`
                let showName = document.createElement('p'); showName.id="showName"; showName.innerText = `Show Name: ${sName}\n`;
                let showTime = document.createElement('p'); showTime.id="showTime"; showTime.innerText = `Show Time: ${sTime}\n`;
                let showIsActive = document.createElement('p'); showIsActive.id="showIsActive"; showIsActive.innerText = `Active? ${sActive}\n`;
                let showTPurchased = document.createElement('p'); showTPurchased.id="showTPurchased"; showTPurchased.innerText = `Tickets Purchased: ${sTicketsPurchased}\n`;
                let showTRemaining = document.createElement('p'); showTRemaining.id="showTRemaining"; showTRemaining.innerText = `Tickets Remaining: ${sTicketsRemaining}\n`;
                let showProfit = document.createElement('p'); showProfit.id="showProfit"; showProfit.innerText = `Total Profit: ${sProfit}`;
                
                show.appendChild(showID);
                show.appendChild(showName);
                show.appendChild(showTime);
                show.appendChild(showIsActive);
                show.appendChild(showTPurchased); 
                show.appendChild(showTRemaining); 
                show.appendChild(showProfit);

                reportDiv.firstChild.lastChild.appendChild(show)
            }

            let grandTotalDiv = document.createElement('div'); grandTotalDiv.className = "gTot-sr";
            grandTotalDiv.innerText = `Total Revenue: ${grandTotalProfit} --- Total Tickets Sold: ${grandTotalTicketsSold}`

            reportDiv.firstChild.lastChild.appendChild(grandTotalDiv);
            
            venueContainer.appendChild(reportDiv);
        }
    }

    post('/showReportVM', payload, handler)
}