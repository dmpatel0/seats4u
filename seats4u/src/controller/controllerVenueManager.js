import { useNavigate } from "react-router-dom";
import { post, get } from "./api"
import { listVenuesHandler } from "../boundary/venues";
import { getVenueHandler } from "../boundary/venue-view";
import { refreshHandler } from "../boundary/venue-view";

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
            /* REPLACE
            document.getElementById("label-password").innerHTML = venuePass
            document.getElementById("api-result").innerHTML = "VENUE CREATED";
            */
        } else {
            /* REPLACE
            document.getElementById("label-password").innerHTML = "XXXXXXXX"
            document.getElementById("api-result").innerHTML = json.error.sqlMessage;
            */
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

export function listVenues() {

    function venueHTML() {

        let venueDiv = document.createElement('div'); venueDiv.className="venue";

        let infoDiv = document.createElement('div'); infoDiv.className="info-container";
        venueDiv.appendChild(infoDiv);

        let venueNameLabel = document.createElement('h3'); venueNameLabel.id="venueNameLabel";
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
                
                post('/listShows', payload, handler)

                venueContainer.appendChild(venueDiv);
            }
        }
    })
    .then(() => {
        let refresh_btn = document.getElementById("btn-refresh")
        refresh_btn.disabled = false;
    })

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

export function checkPassword(venueName, userPass, navFunc) {

    let resource = '/getPassword';

    let payload = {"venueName":venueName};

    const handler = (json) => {
        if(json.statusCode === 200) {
            if(userPass === json.password) {
                alert("PASSWORD MATCHED");
                getVenueHandler(venueName);
                navFunc('/venue-view');
            } else {
                alert("INCORRECT PASSWORD");
            }
        } else {
            console.log(json.error)
        }
    }

    post(resource, payload, handler);

}