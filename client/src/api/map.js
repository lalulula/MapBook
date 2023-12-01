export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;
// import { useSelector } from "react-redux";
// const isAuth = useSelector((state) => state.user.isAuthenticated);

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};

// Create Map
export const createMapAPIMethod = async (mapData) => {
  console.log(mapData);
  try {
    const response = await fetch(`${API_BASE_URL}/api/map/createMap`, {
      ...defaultHeaders,
      method: "POST",
      body: JSON.stringify(mapData), // Assuming selectedMapFile contains the data you want to send
    });

    if (!response.ok) {
      throw new Error("Failed to create map");
    }

    const data = await response.json();
    console.log("Map created successfully:", data);
  } catch (error) {
    console.error("Error creating map:", error.message);
  }
};

export const getAllMapsAPI = () => {
  const res = fetch(`${API_BASE_URL}/api/maps/getAllMaps`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
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
