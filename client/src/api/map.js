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
  var keys = Object.keys(mapData);
  console.log(keys)

  const formData = new FormData();
  formData.append("file", mapData["file"]);

  const keyLen = keys.length;
  for (var i = 0; i < keyLen; i++) {

    if(keys[i] == "mapPreviewImg"){
      var dataName = keys[i]

      var imgDataUrl = mapData[keys[i]]
      var blobBin = atob(imgDataUrl.split(',')[1]);	// base64 데이터 디코딩
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
      }
      var file = new File([new Uint8Array(array)], "mapPreviewImg.png", {type: 'image/png'});	// Blob 생성
      // console.log(file)
      formData.append(dataName, file);	// file data 추가
  
    }
    else{
      console.log(keys[i])
      formData.append(keys[i], mapData[keys[i]]);
    }
  }
  console.log("done for loop")

  const response = await fetch(`${API_BASE_URL}/api/map/createMap`, {
    // ...defaultHeaders,
    method: "POST",
    body: formData,
  });
  return response;

};

// GET ALL MAPS
export const getAllMapsAPI = () => {
  const res = fetch(`${API_BASE_URL}/api/maps/getAllMaps`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
};

// GET ALL MAPS CREATED BY A USER
export const getMapsAPI = (userId) => {
  const res = fetch(`${API_BASE_URL}/api/maps/getMaps/${userId}`, {
    ...defaultHeaders,
    method: "GET",
  }).then(parseJSON);
  return res;
};

// GET A MAP USING A MAP ID
export const getMapAPI = (mapId) => {
  const res = fetch(`${API_BASE_URL}/api/maps/getMap/${mapId}`, {
    ...defaultHeaders,
    method: "GET",
  }).then(parseJSON);
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
