export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
};

const processFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      console.log(result); //올바른 결과 출력(화상이미지 바이너리)
      resolve(result);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Create Map
export const createMapAPIMethod = async (mapData) => {
  var keys = Object.keys(mapData);

  const formData = new FormData();
  formData.append("file", mapData["file"]);

  const keyLen = keys.length;
  for (var i = 0; i < keyLen; i++) {
    if (keys[i] === "mapPreviewImg") {
      const isImageFile = typeof mapData[keys[i]] == "object";
      var dataName = keys[i];
      console.log("mapData[dataName]: ", mapData[dataName])

      if (isImageFile) {
        // read binary data
        const imageReadResult = await processFile(mapData[dataName]);
        console.log("reader.result: ", imageReadResult);

        var file = new File([imageReadResult], "mapPreviewImg.png", {
          type: "image/png",
        }); // Blob 생성

        formData.append(dataName, file); // file data 추가
      } else {
        var imgDataUrl = mapData[dataName];
        var blobBin = atob(imgDataUrl.split(",")[1]); // base64 데이터 디코딩
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        var file = new File([new Uint8Array(array)], "mapPreviewImg.png", {
          type: "image/png",
        }); // Blob 생성

        formData.append(dataName, file); // file data 추가
      }
    } else {
      formData.append(keys[i], mapData[keys[i]]);
    }
  }
  console.log("done for loop");

  const response = await fetch(`${API_BASE_URL}/api/map/createMap`, {
    ...defaultHeaders,
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

export const editMapPostAPIMethod = async (mapId, updateMapPost) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/maps/editMap/${mapId}`, {
      ...defaultHeaders,
      method: "PUT",
      body: JSON.stringify(updateMapPost),
    });
    if (!response.ok) {
      throw new Error(`Error updating post: ${response.statusText}`);
    }
    const responseData = await response.json();
    console.log("POST updated successfully:", responseData.message);
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
};

export const editMapPostAPIMethodWithFile = async (mapId, mapData) => {
  var keys = Object.keys(mapData);
  // console.log(keys);

  const formData = new FormData();
  formData.append("file", mapData["file"]);

  const keyLen = keys.length;
  for (var i = 0; i < keyLen; i++) {
    if (keys[i] == "mapPreviewImg") {
      const isImageFile = typeof mapData[keys[i]] == "object";
      var dataName = keys[i];

      if (isImageFile) {
        // read binary data
        const imageReadResult = await processFile(mapData[dataName]);
        console.log("reader.result: ", imageReadResult);

        var file = new File([imageReadResult], "mapPreviewImg.png", {
          type: "image/png",
        }); // Blob 생성

        formData.append(dataName, file); // file data 추가
      } else {
        var imgDataUrl = mapData[dataName];
        var blobBin = atob(imgDataUrl.split(",")[1]); // base64 데이터 디코딩
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        var file = new File([new Uint8Array(array)], "mapPreviewImg.png", {
          type: "image/png",
        }); // Blob 생성
        // console.log(file)
        formData.append(dataName, file); // file data 추가
      }
    } else {
      // console.log(keys[i]);
      formData.append(keys[i], mapData[keys[i]]);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/maps/${mapId}`, {
      // ...defaultHeaders,
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error updating post: ${response.statusText}`);
    }
    const responseData = await response.json();
    console.log("POST updated successfully:", responseData.message);
    return response;
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
};

export const deleteMapPostAPIMethod = (mapId) => {
  console.log(mapId);
  return fetch(`${API_BASE_URL}/api/maps/removeMap/${mapId}`, {
    ...defaultHeaders,
    method: "DELETE",
  }).then(parseJSON);
};

// LIKE A MAP
export const likeMapAPIMethod = (mapId, isAuth, userId) => {
  const res = fetch(`${API_BASE_URL}/api/maps/likeMap/${mapId}`, {
    ...defaultHeaders,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${isAuth}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(userId),
  });
  return res;
};

// Get All Map Comments
export const getAllMapCommentsAPIMethod = (mapPostId) => {
  console.log(`${API_BASE_URL}/api/mapComment/mapComments/${mapPostId}`);
  const res = fetch(`${API_BASE_URL}/api/mapComment/mapComments/${mapPostId}`, {
    ...defaultHeaders,
    method: "GET",
  })
    .then(checkStatus)
    .then(parseJSON);
  return res;
};

export const getAllExistingMapCommentsAPIMethod = () => {
  return fetch(
    `${API_BASE_URL}/api/mapComment/existingMapComments`,
    //await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    {
      ...defaultHeaders,
      method: "GET",
    }
  ).then(parseJSON);
};

export const createMapCommentAPIMethod = (comment) => {
  return fetch(`${API_BASE_URL}/api/mapComment/createMapComment`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(comment),
  }).then(parseJSON);
};

export const updateMapCommentAPIMethod = (id, newComment) => {
  return fetch(`${API_BASE_URL}/api/mapComment/editMapComment/${id}`, {
    ...defaultHeaders,
    method: "PUT", // The method defaults to GET
    body: JSON.stringify(newComment),
  });
};

export const deleteMapCommentAPIMethod = (mapCommentId) => {
  return fetch(
    `${API_BASE_URL}/api/mapComment/deleteMapComment/${mapCommentId}`,
    {
      ...defaultHeaders,
      method: "DELETE",
    }
  ).then(parseJSON);
};

export const getAllMapPostRepliesAPIMethod = (id) => {
  return fetch(`${API_BASE_URL}/api/mapReply/mapReplies/${id}`, {
    ...defaultHeaders,
    method: "GET",
  }).then(parseJSON);
};

export const getAllExistingMapPostRepliesAPIMethod = () => {
  return fetch(`${API_BASE_URL}/api/mapReply/existingMapReplies`, {
    ...defaultHeaders,
    method: "GET",
  }).then(parseJSON);
};

export const createMapPostReplyAPIMethod = (reply) => {
  return fetch(`${API_BASE_URL}/api/mapReply/createMapReply`, {
    ...defaultHeaders,
    method: "POST",
    body: JSON.stringify(reply),
  }).then(parseJSON);
};

export const updateMapPostReplyAPIMethod = (id, newReply) => {
  return fetch(`${API_BASE_URL}/api/mapReply/editMapReply/${id}`, {
    ...defaultHeaders,
    method: "PUT", // The method defaults to GET
    body: JSON.stringify(newReply),
  });
};

export const deleteMapPostReplyAPIMethod = (replyId) => {
  return fetch(`${API_BASE_URL}/api/mapReply/deleteMapReply/${replyId}`, {
    ...defaultHeaders,
    method: "DELETE",
  }).then(parseJSON);
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
