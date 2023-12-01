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

export const getSocialCommentAPI = (id) => {
  return fetch(`${API_BASE_URL}/api/socialComment/${id}`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
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
  return fetch(`${API_BASE_URL}/api/socialComment/existingSocialComments`,
    //await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const deleteSocialCommentAPIMethod = (commentId) => {
  return fetch(
    `${API_BASE_URL}/api/socialComment/deleteSocialComment/${commentId}`,
    {
      ...defaultHeaders,
      method: "DELETE",
    }
  ).then(parseJSON);
};


export const createSocialCommentAPIMethod = (comment) => {
  return fetch(`${API_BASE_URL}/api/socialComment/createSocialComment`, {
    ...defaultHeaders,
    method: 'POST',
    body: JSON.stringify(comment),
  }).then(parseJSON);
}

export const updateSocialCommentAPIMethod = (id, newComment) => {
  return fetch(
    `${API_BASE_URL}/api/socialComment/editSocialComment/${id}`,
    {
      ...defaultHeaders,
      method: "PUT", // The method defaults to GET
      body: JSON.stringify(newComment),
    }
  );
};

export const getAllExistingSocialRepliesAPI = () => {
  return fetch(`${API_BASE_URL}/api/socialCommentReply/existingSocialPostReplies`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const getAllSocialRepliesAPI = (id) => {
  return fetch(`${API_BASE_URL}/api/socialCommentReply/socialPostReplies/${id}`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const createSocialReplyAPIMethod = (reply) => {
  return fetch(`${API_BASE_URL}/api/socialCommentReply/createSocialPostReply`, {
    ...defaultHeaders,
    method: 'POST',
    body: JSON.stringify(reply),
  }).then(parseJSON);
}

export const updateSocialReplyAPIMethod = (id, newReply) => {
  return fetch(
    `${API_BASE_URL}/api/socialCommentReply/editSocialPostReply/${id}`,
    {
      ...defaultHeaders,
      method: "PUT", // The method defaults to GET
      body: JSON.stringify(newReply),
    }
  );
};

export const deleteSocialReplyAPIMethod = (replyId) => {
  return fetch(
    `${API_BASE_URL}/api/socialCommentReply/deleteSocialPostReply/${replyId}`,
    {
      ...defaultHeaders,
      method: "DELETE",
    }
  ).then(parseJSON);
};

//map comments
/* export const getAllSocialCommentsReplyAPIMethod = () => {
  return fetch(
    `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcommentsreply`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(checkStatus);
}; */

/* export const getAllMapCommentsReplyAPIMethod = () => {
  return fetch(
    `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcommentsreply`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(checkStatus);
}; */

function parseJSON(response) {
  return response.json();
}
