// import { useSelector } from "react-redux";
// const isAuth = useSelector((state) => state.user.isAuthenticated);
export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};

// Get All Social Post (For SocialPage)
export const getAllSocialPostsAPIMethod = () => {
  const res = fetch(`${API_BASE_URL}/api/social/socialPosts`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
};
// Get Social Post by PostID(For PostDetails)
export const getSocialPostAPIMethod = (socialPostId) => {
  const res = fetch(`${API_BASE_URL}/api/social/socialPost/${socialPostId}`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
};
// Get MySocial Post by UserId(For MySocialPosts)
export const getMySocialPostAPIMethod = (currentUserId) => {
  const res = fetch(
    `${API_BASE_URL}/api/social/mySocialPost/${currentUserId}`,
    {
      ...defaultHeaders,
      method: "GET",
    }
  )
    .then(checkStatus)
    .then(parseJSON);
  console.log(res);
  return res;
};
// Create Social Post
export const createSocialPostAPIMethod = async (socialPost) => {
  console.log("create social post");
  // console.log(socialPost)
  var keys = Object.keys(socialPost);
  const formData = new FormData();

  for (var i = 0; i < keys.length; i++) {
    console.log(typeof keys[i]);
    if (keys[i] === "post_images") {
      for (var j = 0; j < socialPost[keys[i]].length; j++) {
        formData.append(keys[i], socialPost[keys[i]][j]);
      }
    } else {
      formData.append(keys[i], socialPost[keys[i]]);
    }
  }
  // formData.append("image", selectedFile);
  // formData.append("username", username);
  console.log("FORMDATA CREATE", formData);

  const response = await fetch(`${API_BASE_URL}/api/social/createSocialPost`, {
    // ...defaultHeaders,
    method: "PUT",
    body: formData,
  });
  return response;
};

export const likeSocialPostAPIMethod = (postId, userId) => {
  return fetch(`${API_BASE_URL}/api/social/likePost/${postId}`, {
    ...defaultHeaders,
    method: "PUT", // The method defaults to GET
    body: JSON.stringify(userId),
  });
  //return response;
};

// // Create Social Post
// export const createSocialPostAPIMethod = async (socialPost) => {
//   console.log(socialPost);
//   const response = await fetch(`${API_BASE_URL}/api/social/createSocialPost`, {
//     ...defaultHeaders,
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(socialPost),
//   });
//   return response;
// };

// Delete Social Post by PostID
export const deleteSocialPostAPIMethod = async (socialPostId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/social/deleteSocialPost/${socialPostId}`,
      {
        ...defaultHeaders,
        method: "DELETE",
      }
    ).then(checkStatus);

    // Check if the delete operation was successful
    if (response) {
      return true; // Indicates success
    } else {
      return false; // Indicates failure
    }
  } catch (error) {
    console.error("Error deleting social post:", error);
    return false; // Indicates failure
  }
};
// Edit Social Post by PostID
export const editSocialPostAPIMethod = async (sPostId, socialpost) => {
  console.log("POSt", socialpost, sPostId);
  try {

    var keys = Object.keys(socialpost);
    const formData = new FormData();

    for (var i = 0; i < keys.length; i++) {
      console.log(typeof keys[i]);
      if (keys[i] === "post_images") {
        console.log("socialpost[keys[i]]: ", socialpost[keys[i]])
        for (var j = 0; j < socialpost[keys[i]].length; j++) {
          formData.append(keys[i], socialpost[keys[i]][j]);
        }
      } else {
        formData.append(keys[i], socialpost[keys[i]]);
      }
    }
    console.log("FORMDATA EDIT", formData);

    const response = await fetch(
      `${API_BASE_URL}/api/social/editSocialPost/${sPostId}`,
      {
        // ...defaultHeaders,
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating post: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("POST updated successfully:", responseData.message);
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
};

export const addViewCountSocialPostAPIMethod = async (socialPostId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/social/addViewCount/${socialPostId}`,
      {
        ...defaultHeaders,
        method: "put",
      }
    ).then(checkStatus);

    // Check if the delete operation was successful
    if (response) {
      return true; // Indicates success
    } else {
      return false; // Indicates failure
    }
  } catch (error) {
    console.error("Error deleting social post:", error);
    return false; // Indicates failure
  }
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

function parseJSON(response) {
  return response.json();
}
