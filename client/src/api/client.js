const defaultHeaders = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
}

export const createUserAPIMethod = (user) => {
    const response = fetch(`http://localhost:3001/api/auth/register`, {
        ...defaultHeaders,
        method: 'POST',
        body: JSON.stringify(user),
    });
    /* const response_1 = checkStatus(response); */
    return response;
}


/* function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        throw error;
    }
} */

function parseJSON(response) {
    return response.json();
}