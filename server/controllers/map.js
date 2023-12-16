const MapObj = require("../models/MapObj");
const serviceAccount = require("../mapbook-firebase.json");
const cloudinary = require("cloudinary").v2;
const MapComment = require("../models/MapComment");
const MapReply = require("../models/MapReply");

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
    res.status(500).json({ message: error.message });
  }
};

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

// GET A MAP BY: MAP ID
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
    const { map_name, topic, user_id, is_visible, map_description } = req.body;
    // console.log(req.files);
    if (req.files !== undefined) {
      console.log("file", req.files["file"][0]);
      console.log("mapPreviewImg", req.files["mapPreviewImg"][0]);

      const randomString = (new Date().getTime() + Math.random())
        .toString(36)
        .substring(2);
      // console.log("randomString :", randomString)

      const fileBuffer = req.files["file"][0].buffer;
      const fileName = randomString + req.files["file"][0].originalname;
      const storageRef = bucket.file(fileName);
      await storageRef.createWriteStream().end(fileBuffer);

      const [fileUrl] = await storageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2025", // Replace with an expiration date
      });

      const imgFileBuffer = req.files["mapPreviewImg"][0].buffer;
      const imgFileName =
        randomString + req.files["mapPreviewImg"][0].originalname;
      const imgStorageRef = bucket.file(imgFileName);
      await imgStorageRef.createWriteStream().end(imgFileBuffer);

      const [mapPreviewImgUrl] = await imgStorageRef.getSignedUrl({
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

      if (user != null) {
        const mapsCreated = user["maps_created"];

        mapsCreated.push(savedMap["_id"]);

        const userSave = await User.findByIdAndUpdate(
          user_id,
          {
            maps_created: mapsCreated,
          },
          { new: true }
        );
      } else {
        console.log("user not found");
      }

      // Respond with success message
      // return res.status(201).json({ success: true, message: "Map created successfully!" });
      return res.status(201).json(savedMap);
    } else {
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
      );
      return res.status(201).json(savedMap);
    }
  } catch (error) {
    console.error("Error creating map:", error);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      const validationErrors = {};

      // Extract field-specific errors
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return res.status(400).json({ validationErrors });
    }

    return res.status(500).json({ error: error.message });
  }
};

// Update map
const editMap = async (req, res) => {
  try {
    const { mapId } = req.params;
    console.log("mapId:", mapId)
    if (req.files !== undefined) {
      console.log("editmap called");

      const {
        map_name,
        topic,
        user_id,
        is_visible,
        map_description,
        mapPreviewImg,
        file_path,
        map_users_liked,
        created_at,
        view_count,
      } = req.body;



      const randomString = (new Date().getTime() + Math.random())
        .toString(36)
        .substring(2);

      const fileBuffer = req.files["file"][0].buffer;
      const fileName = randomString + req.files["file"][0].originalname;
      const storageRef = bucket.file(fileName);
      await storageRef.createWriteStream().end(fileBuffer);

      const [fileUrl] = await storageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2025", // Replace with an expiration date
      });

      const imgFileBuffer = req.files["mapPreviewImg"][0].buffer;
      const imgFileName =
        randomString + req.files["mapPreviewImg"][0].originalname;
      const imgStorageRef = bucket.file(imgFileName);
      await imgStorageRef.createWriteStream().end(imgFileBuffer);

      const [mapPreviewImgUrl] = await imgStorageRef.getSignedUrl({
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
          file_path: fileUrl,
          map_description: map_description,
          mapPreviewImg: mapPreviewImgUrl,
          map_users_liked: map_users_liked,
        },
        { new: true }
      );

      // Respond with success message
      // return res.status(201).json({ success: true, message: "Map created successfully!" });
      return res.status(201).json(updatedMap);
    } else {
      const {
        map_name,
        topic,
        user_id,
        is_visible,
        map_description,
        mapPreviewImg,
        file_path,
        map_users_liked,
        created_at,
        view_count,
      } = req.body;

      const updatedMap = await MapObj.findByIdAndUpdate(
        mapId,
        {
          map_name: map_name,
          topic: topic,
          user_id: user_id,
          is_visible: is_visible,
          file_path: file_path,
          view_count: view_count,
          map_description: map_description,
          mapPreviewImg: mapPreviewImg,
          map_users_liked: map_users_liked,
          created_at: created_at,
        },
        { new: true }
      );

      // Respond with success message
      // return res.status(201).json({ success: true, message: "Map created successfully!" });
      return res.status(201).json(updatedMap);
    }
  } catch (error) {
    console.error("Error updating map:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// REMOVE A MAP
const removeMap = async (req, res) => {
  try {
    const { mapId } = req.params;
    const map = await MapObj.findByIdAndDelete(mapId);

    if (!map) {
      return res.status(400).json("Map not found");
    }

    // DELETE ASSOCIATED MAP COMMENTS & REPLIES
    const deletedMapComments = await MapComment.find({ map_id: mapId });

    await Promise.all(
      deletedMapComments.map(async (deletedMapComment) => {
        await MapReply.deleteMany({ map_comment_id: deletedMapComment._id });
      })
    );
    await MapComment.deleteMany({ map_id: mapId });

    // DELETE STORED FILE ON FIREBASE
    try {
      const mapUrl = map.file_path;
      const mapPreviewUrl = map.mapPreviewImg;

      const mapUrlParts = new URL(mapUrl);
      let mapFilename = path
        .basename(mapUrlParts.pathname)
        .replaceAll("%20", " ");
      const mapFile = bucket.file(mapFilename);

      const mapPreviewUrlParts = new URL(mapPreviewUrl);
      let mapPreviewFilename = path
        .basename(mapPreviewUrlParts.pathname)
        .replaceAll("%20", " ");
      const mapPreviewFile = bucket.file(mapPreviewFilename);

      await mapFile.delete();
      await mapPreviewFile.delete();
      console.log(`mapFile ${mapFilename} deleted successfully.`);
      console.log(`mapPreviewFile ${mapPreviewFilename} deleted successfully.`);
    } catch (err) {
      console.log("Not able to delete files. Such files do not exist");
    }

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
