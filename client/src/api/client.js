const defaultHeaders = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
}

export const createUserAPIMethod = (user) => {
    /* const response = fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/register`, {
        ...defaultHeaders,
        method: 'POST',
        body: JSON.stringify(user),
    }); */
    const response = fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/register`, {
        ...defaultHeaders,
        method: 'POST',
        body: JSON.stringify(user),
    }).then(checkStatus);
    /* const response_1 = checkStatus(response); */
    return response;
}

export const loginUserAPIMethod = async (user) => {
    const response = await fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/login`, {
        ...defaultHeaders,
        method: 'POST',
        body: JSON.stringify(user),
    }).then(checkStatus);


    return response;
}

export const updateUserAPIMethod = (user) => {
    return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/user`, {
        ...defaultHeaders,
        method: 'PUT', // The method defaults to GET
        body: JSON.stringify(user),
    }).then(checkStatus);
}

export const getUserAPIMethod = (userId) => {
    return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/user`, {
        ...defaultHeaders,
        method: 'GET'
    }).then(checkStatus);
}


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}