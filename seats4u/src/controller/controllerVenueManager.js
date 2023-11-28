import { post, get } from "./api"

export function createVenue(venueName, numRows) {

    let name = venueName;
    let nRows = numRows;

    let resource = '/createVenue'

    let venuePass = Math.random().toString(36).substring(2,7);
    document.getElementById("venuePassword").value = venuePass

    console.log(venuePass);

    console.log(name);
    console.log(nRows);
    let payload = {"venueName":name, "numRows":numRows, "password":venuePass}

    const handler = (json) => {
        document.getElementById("api-result").value = json.body
    }

    post(resource, payload, handler)
}

export function getPassword(venueName) {

    let pass

    get('/getPassword')
    .then(function(response) {
        pass = response.password
    })

    console.log(pass);
}