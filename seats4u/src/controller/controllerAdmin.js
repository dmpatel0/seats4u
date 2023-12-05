import { refreshHandler } from "../boundary/venue-view";
import { get, post } from "../controller/api";

export function deleteShowAdmin(showID) {

    let resource = '/deleteShowAdmin';
    let payload = {"showID":showID};

    const handler = (json) => {
        if(json.statusCode === 200) {
            alert("Show Deleted");
            refreshHandler();
        } else {
            alert(`Error: ${json.error}`)
        }
    }

    post(resource, payload, handler);
}