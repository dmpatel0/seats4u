import { redrawCanvas } from "../boundary/venue-view"
import { post, get } from "./api"

export function getSeats(showID, canvasObj) {

    let resource = '/getSeats'

    let payload = {"showID":showID}

    const handler = (json) => {
        if(json.statusCode === 200) {
            redrawCanvas(json, canvasObj);
        } else {
            console.log(`getSeats Error: ${json.error}`);
        }
    } 

    post(resource, payload, handler)
}