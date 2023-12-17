export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};
// Get All Users (For ManageUsers)
export const getAllUsersAPIMethod = () => {
  const res = fetch(`${API_BASE_URL}/api/users`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
};
//get a user by ID
export const getUserById = (userId) => {
  const response = fetch(`${API_BASE_URL}/api/users/getUser/${userId}`, {
    ...defaultHeaders,
  })
    .then(checkStatus)
    .then(parseJSON);
  return response;
};

// UPDATE USER
export const updateUserAPIMethod = async (
  username,
  selectedFile,
  userId,
  isAuth
) => {
  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("username", username);
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${isAuth}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error updating user: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
    console.log("User updated successfully:", responseData);
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

// REMOVE A USER
export const removeUserAPIMethod = async (userId, isAuth) => {
  try {
    await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${isAuth}` },
    });
  } catch (error) {
    console.error("Error removing a user account:", error.message);
  }
};
// REMOVE A USER : For Admin
export const adminRemoveUserAPIMethod = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/admin/${userId}`, {
      ...defaultHeaders,
      method: "DELETE",
    }).then(checkStatus);

    if (response) {
      console.log(response.status);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error removing a user account: ", error);
    return false;
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
