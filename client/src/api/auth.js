export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};

//register user
export const createUserAPIMethod = (user) => {
  console.log("User Data:", user);
  const response = fetch(`${API_BASE_URL}/api/auth/register`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(user),
  });
  console.log("API Response:", response);
  return response;
};

//login user
export const loginUserAPIMethod = async (user) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(user),
  });

  return response;
};

// RESET PASSWORD REQUEST
export const resetPasswordRequestAPIMethod = (email) => {
  const response = fetch(`${API_BASE_URL}/api/auth/resetPasswordRequest`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(email),
  });
  return response;
};

// RESET PASSWORD
export const resetPasswordAPIMethod = (password) => {
  const response = fetch(`${API_BASE_URL}/api/auth/resetPassword`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(password),
  });
  return response;
};

// VALIDATE RESET PASSWORD TOKEN
export const validateResetTokenAPIMethod = (resetToken) => {
  const response = fetch(`${API_BASE_URL}/api/auth/validateResetToken`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(resetToken),
  });
  return response;
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
