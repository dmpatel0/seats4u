const url = 'https://13ss41qmlg.execute-api.us-east-2.amazonaws.com/G127';

function api(resource) {
    return url + resource;
}

export async function post(resource, payload, handler) {
    fetch(api(resource), {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((responseJson) => handler(responseJson))
    .catch((err) => handler(err))
}

export async function get(resource) {
    const response = await fetch(api(resource), {
        method: "GET"
    })

    return response.json() 
}