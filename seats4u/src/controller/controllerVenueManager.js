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

export function createShow(showName, showDate, showTime, showPrice) {
    let name = showName;
    let date = showDate;
    let time = showTime;
    let price = showPrice;

    let resource = '/createShow'

    console.log(name);
    console.log(date);
    console.log(time);
    console.log(price);

    let payload = {"showName":name, "showDate":date, "showTime":time, "showPrice":price}

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

        let show = document.createElement('div'); show.className="show";
        showsDiv.appendChild(show);

        // Seperate this
        let showName = document.createElement('p'); showName.id="showName";
        let showDate = document.createElement('p'); showDate.id="showDate";
        show.appendChild(showName); show.appendChild(showDate);

        return venueDiv;
    }

    get('/listVenuesAdmin')
    .then(function (response) {

        let venueContainer = document.getElementById("venues-data-container");
        let venues = response.venues;

        for(let i=0; i<venues.length; i++) {
            let venueDiv = venueHTML();
            let venueNameLabel = venueDiv.firstChild.firstChild; venueNameLabel.innerHTML=venues[i].venueName;

            venueDiv.title = venues[i].venueName;

            venueDiv.firstChild.lastChild.firstChild.firstChild.innerHTML = "TAYLOR SWIFT";

            venueContainer.appendChild(venueDiv);
        }

    })
}

export async function deleteVenue(venueName) {

    let name = venueName;
    let resource = '/deleteVenue';

    let payload = {"venueName":name};

    const handler = (json) => {
        if(json.statusCode === 200) {
            alert("Venue Deleted");
            return 1;
        } else {
            return 0;
        }
    }

    post(resource, payload, handler);

}

export function getPassword(venueName) {

    let resource = '/getPassword';

    let payload = {"venueName":venueName};

    const handler = (json) => {
        console.log(json.password);
    }

    post(resource, payload, handler);
    
}