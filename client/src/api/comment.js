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

function parseJSON(response) {
  return response.json();
}
