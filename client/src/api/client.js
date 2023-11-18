import { useSelector } from "react-redux";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

// const isAuth = useSelector((state) => state.user.isAuthenticated);

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};

//GET
//get a user
// export const getUserAPIMethod = (userId, token) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/user/${userId}`,
//     {
//       ...defaultHeaders,
//       Authorization: `Bearer ${token}`,
//       method: "GET",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//get a map
// export const getMapAPIMethod = (mapId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/map/${mapId}`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all maps
// export const getAllMapsAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/map`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get a social post
// export const getSocialPostAPIMethod = (socialPostId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialpost/${socialPostId}`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all social posts
// export const getAllSocialPostsAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialposts`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all comments on maps
// export const getAllMapCommentsAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcomments`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all comments on social posts
// export const getAllSocialCommentsAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcomments`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all comment replies on social posts
// export const getAllSocialCommentsReplyAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcommentsreply`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all comment replies on maps
// export const getAllMapCommentsReplyAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcommentsreply`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get all users (admin)
// export const getAllUsersAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/users`,
//     {
//       ...defaultHeaders,
//       method: "GET",
//     }
//   ).then(checkStatus);
// };

//get admin
// export const getAdminAPIMethod = () => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/users/admin`,
//     {
//       ...defaultHeaders,
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//END OF GET

//POST
//register
export const createUserAPIMethod = (user) => {
  // const response = fetch(
  //   `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/register`,
  //   {
  //     ...defaultHeaders,
  //     method: "POST",
  //     body: JSON.stringify(user),
  //   }
  // ).then(checkStatus);
  console.log("User Data:", user);
  const response = fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      ...defaultHeaders,
      method: "POST",
      body: JSON.stringify(user),
    }
  );
  console.log("API Response:", response);
  return response;
};

//login
export const loginUserAPIMethod = async (user) => {
  // const response = await fetch(
  //   `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/login`,
  //   {
  //     ...defaultHeaders,
  //     method: "POST",
  //     body: JSON.stringify(user),
  //   }
  // ).then(checkStatus);
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      ...defaultHeaders,
      method: "POST",
      body: JSON.stringify(user),
    }
  );

  return response;
};

// //create a new map
// export const createMapAPIMethod = (map) => {
//   return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/map`, {
//     ...defaultHeaders,
//     method: 'POST', // The method defaults to GET
//     body: JSON.stringify(answer),
//   }).then(checkStatus)
//     .then(parseJSON);
// }

// //create a new social post
export const createSocialPostAPIMethod = (socialPost) => {
  console.log(socialPost);
  return fetch(
    `${API_BASE_URL}/api/auth/socialpost`,
    {
      ...defaultHeaders,
      method: "POST", // The method defaults to GET
      body: JSON.stringify(socialPost),
    }
  )
    .then(checkStatus)
    .then(parseJSON);
};

// //create a comment on map
// export const createMapCommentAPIMethod = (comment) => {
//   return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcomment`, {
//     ...defaultHeaders,
//     method: 'POST', // The method defaults to GET
//     body: JSON.stringify(answer),
//   }).then(checkStatus)
//     .then(parseJSON);
// }

// //create a comment on a social post
// export const createSocialCommentAPIMethod = (comment) => {
//   return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcomment`, {
//     ...defaultHeaders,
//     method: 'POST', // The method defaults to GET
//     body: JSON.stringify(answer),
//   }).then(checkStatus)
//     .then(parseJSON);
// }

// //create a reply on map comment
// export const createMapCommentReplyAPIMethod = (comment) => {
//   return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcommentreply`, {
//     ...defaultHeaders,
//     method: 'POST', // The method defaults to GET
//     body: JSON.stringify(answer),
//   }).then(checkStatus)
//     .then(parseJSON);
// }

// //create a reply on social post comment
// export const createSocialCommentReplyAPIMethod = (comment) => {
//   return fetch(`https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcommentreply`, {
//     ...defaultHeaders,
//     method: 'POST', // The method defaults to GET
//     body: JSON.stringify(answer),
//   }).then(checkStatus)
//     .then(parseJSON);
// }

//upload image (cloud platform is tentative)
// export const uploadImageToCloudinaryAPIMethod = (formData) => {
//   const cloudName = "samuelhan";
//   return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
//     method: "POST",
//     body: formData,
//   })
//     .then(checkStatus)
//     .then(parseJSON);
// };

//END OF POST

//PUT
//update a user
// export const updateUserAPIMethod = (user) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/user`,
//     {
//       ...defaultHeaders,
//       method: "PUT", // The method defaults to GET
//       body: JSON.stringify(user),
//     }
//   ).then(checkStatus);
// };
//END OF PUT

//DELETE
// export const deleteUserAPIMethod = (userId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/users/${userId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a map
// export const deleteMapAPIMethod = (mapId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/users/${mapId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a social post
// export const deleteSocialPostAPIMethod = (socialPostId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialpost/${socialPostId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a comment on a map
// export const deleteMapCommentAPIMethod = (commentId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcomment/${commentId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a reply on a social post comment
// export const deleteSocialCommentReplyAPIMethod = (commentId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcomment/${commentId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a reply on a map comment
// export const deleteMapCommentReplyAPIMethod = (commentId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/mapcomment/${commentId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

//delete a comment on a social post
// export const deleteSocialCommentAPIMethod = (commentId) => {
//   return fetch(
//     `https://mapbookbackend-bfa7bc027f74.herokuapp.com/api/auth/socialcomment/${commentId}`,
//     {
//       ...defaultHeaders,
//       method: "DELETE",
//     }
//   )
//     .then(checkStatus)
//     .then(parseJSON);
// };

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
