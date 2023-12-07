const MapObj = require("../models/MapObj");
const serviceAccount = require("../mapbook-firebase.json");
const cloudinary = require("cloudinary").v2;


const admin = require("firebase-admin");
const { URL } = require("url");
const path = require("path");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

// INITIALIZE FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();

const getAllMaps = async (req, res) => {
  try {
    const map = await MapObj.find();
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET ALL MAPS CREATED BY A USER
const getMaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const map = await MapObj.find({ user_id: userId });
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET A MAP BY A MAP ID
const getMap = async (req, res) => {
  try {
    const { mapId } = req.params;
    const map = await MapObj.findById(mapId);
    res.status(200).json(map);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create map
const createMap = async (req, res) => {
  try {
    const {
      map_name,
      topic,
      user_id,
      is_visible,
      map_description,
    } = req.body;
    // console.log(req.files);
    if(req.files !== undefined){
      console.log("file", req.files["file"][0]);
      console.log("mapPreviewImg", req.files["mapPreviewImg"][0]);

      const randomString = (new Date().getTime() + Math.random()).toString(36).substring(2)
      // console.log("randomString :", randomString)

      const fileBuffer = req.files["file"][0].buffer;
      const fileName = randomString + req.files["file"][0].originalname;
      const storageRef =  bucket.file(fileName);
      await storageRef.createWriteStream().end(fileBuffer);

      const [fileUrl] = await storageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2025", // Replace with an expiration date
      });



      const imgFileBuffer = req.files["mapPreviewImg"][0].buffer;
      const imgFileName = randomString + req.files["mapPreviewImg"][0].originalname;
      const imgStorageRef = bucket.file(imgFileName);
      await imgStorageRef.createWriteStream().end(imgFileBuffer);

      const [mapPreviewImgUrl]  = await imgStorageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2025", // Replace with an expiration date
      });

      const newMap = new MapObj({
        map_name,
        topic,
        user_id,
        is_visible,
        map_description,
        mapPreviewImg: mapPreviewImgUrl,
        file_path: fileUrl,
      });
      const savedMap = await newMap.save();

      const user = await User.findById(user_id);

      if(user != null){
        const mapsCreated = user["maps_created"];

        mapsCreated.push(savedMap["_id"]);

        const userSave = await User.findByIdAndUpdate(
          user_id,
          {
            maps_created: mapsCreated,
          },
          { new: true }
        )
      }
      else{
        console.log("user not found")
      }

      // Respond with success message
      // return res.status(201).json({ success: true, message: "Map created successfully!" });
      return res.status(201).json(savedMap);
    }
    else{
      const newMap = new MapObj({
        map_name,
        topic,
        user_id,
        is_visible,
        map_description,
      });
      // console.log(newMap)
      const savedMap = await newMap.save();

      const user = await User.findById(user_id);
      const mapsCreated = user["maps_created"];
      mapsCreated.push(savedMap["_id"]);
      await User.findByIdAndUpdate(
        user_id,
        {
          maps_created: mapsCreated,
        },
        { new: true }
      )

      // Respond with success message
      // return res.status(201).json({ success: true, message: "Map created successfully!" });
      return res.status(201).json(savedMap);
    }

  } catch (error) {
    // console.error("Error creating map:", error);
    // return res.status(500).json({ success: false, error: error.message });
    return res.status(500).json({ error: error.message });

  }
};

// Update map
const editMap = async (req, res) => {
  try {
    const { mapId } = req.params;

    const {
      map_name,
      topic,
      user_id,
      is_visible,
      template,
      colors,
      data_names,
      data_values,
      heat_range,
    } = req.body;

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const storageRef = bucket.file(fileName);
    await storageRef.createWriteStream().end(fileBuffer);

    const [fileUrl] = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2025", // Replace with an expiration date
    });

    const updatedMap = await MapObj.findByIdAndUpdate(
      mapId,
      {
        map_name: map_name,
        topic: topic,
        user_id: user_id,
        is_visible: is_visible,
        template: template,
        file_path: fileUrl,
        colors: colors,
        data_names: data_names,
        data_values: data_values,
        heat_range: heat_range,
      },
      { new: true }
    );

    // Respond with success message
    res.status(200).json(updatedMap);
  } catch (error) {
    console.error("Error updating map:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// REMOVE A MAP
const removeMap = async (req, res) => {
  try {
    const { id } = req.params;
    const map = await MapObj.findByIdAndDelete(id);

    if (!map) {
      return res.status(400).json("Map not found");
    }

    // DELETE STORED FILE ON FIREBASE
    const url = map.file_path;
    const urlParts = new URL(url);
    const filename = path.basename(urlParts.pathname);
    const file = bucket.file(filename);

    file
      .delete()
      .then(() => {
        console.log(`File ${filename} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Error deleting file ${filename}:`, error);
      });

    res.status(200).json("Map deleted successfully");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update map like
const likeMap = async (req, res) => {
  try {
    const { sMapId } = req.params;
    const { userId } = req.body;
    const mapObj = await MapObj.findById(sMapId);
    const likedUsers = mapObj["map_users_liked"];

    const index = likedUsers.indexOf(userId);
    if (index === -1) {
      likedUsers.push(userId);
    } else {
      likedUsers.splice(index, 1);
    }
    const updatedMap = await MapObj.findByIdAndUpdate(
      sMapId,
      {
        map_users_liked: likedUsers,
      },
      { new: true }
    );
    res.status(200).json(updatedMap);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getAllMaps: getAllMaps,
  getMaps: getMaps,
  getMap: getMap,
  createMap: createMap,
  editMap: editMap,
  removeMap: removeMap,
  likeMap: likeMap,
};
