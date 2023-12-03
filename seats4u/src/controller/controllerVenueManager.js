import { json } from "react-router-dom";
import { post, get } from "./api"

export function createVenue(venueName, numRows) {

    let name = venueName;
    let nRows = numRows;

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

                venueDiv.title = venues[i].venueName;
                
                let payload = {"venueName":venues[i].venueName};

                const handler = (json) => {
                    if(json.statusCode === 200) {
                        let shows = json.shows
                        console.log("show retrieved!")
                        console.log(`post response: ${json.statusCode}`);
                        console.log(json);
                        //let shows = response.shows
                        for(let j=0; j<shows.length; j++) {
                            let sName = shows[j].showName;
                            let sDateTime = shows[j].showTime;

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

        return new Promise(function (resolve, reject) {
            resolve(200);
        })

    })

}

export function deleteVenue(venueName) {

    let name = venueName;
    let resource = '/deleteVenue';

    let payload = {"venueName":name};

    const handler = (json) => {
        return new Promise(function (resolve, reject) {
            if(json.statusCode === 200) {
                resolve(json.statusCode);
            } else {
                reject(json.error);
            }
        })
    }

    post(resource, payload, handler);

}

export function getPassword(venueName, userPass) {

    let resource = '/getPassword';

    let payload = {"venueName":venueName};

    const handler = (json) => {
        if(json.statusCode === 200) {
            if(userPass === json.password) {
                console.log(`userpass: ${userPass}, servPass: ${json.password}`)
                return true;
            } else {
                console.log(`userpass: ${userPass}, servPass: ${json.password}`)
                return false;
            }
        } else {
            console.log(json.error)
        }
    }

    post(resource, payload, handler);

}