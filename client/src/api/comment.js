export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;
// import { useSelector } from "react-redux";
// const isAuth = useSelector((state) => state.user.isAuthenticated);

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};
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

export const getAllMapCommentsAPIMethod = () => {
  return fetch(
    `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcomments`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(checkStatus);
};

export const getAllSocialCommentsAPI = (id) => {
  console.log(`${API_BASE_URL}/api/socialComment/socialComments/${id}`);
  return fetch(`${API_BASE_URL}/api/socialComment/socialComments/${id}`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const getAllExistingSocialCommentsAPI = () => {
  console.log(`${API_BASE_URL}/api/socialComment/existingSocialComments`);
  return fetch(`${API_BASE_URL}/api/socialComment/existingSocialComments`,
    //await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const getAllSocialCommentsReplyAPIMethod = () => {
  return fetch(
    `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcommentsreply`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(checkStatus);
};

export const getAllMapCommentsReplyAPIMethod = () => {
  return fetch(
    `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcommentsreply`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(checkStatus);
};

function parseJSON(response) {
  return response.json();
}
