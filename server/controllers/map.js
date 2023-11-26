const MapObj = require("../models/MapObj");
const serviceAccount = require('../mapbook-firebase.json');

const admin = require("firebase-admin");
const { URL } = require('url');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

// INITIALIZE FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();

// GET ALL MAPS CREATED BY A USER
const getMaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const map = await MapObj.find({ user_id: userId });
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET A MAP BY A MAP ID
const getMap = async (req, res) => {
  try {
    const { mapId } = req.params;
    const map = await MapObj.find({ _id: mapId });
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create map
const createMap = async (req, res) => {
  try {
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
      map_users_liked, 
      created_at 
    } = req.body;

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const storageRef = bucket.file(fileName);
    await storageRef.createWriteStream().end(fileBuffer);

    const [fileUrl] = await storageRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2025', // Replace with an expiration date
    });

    const newMap = new MapObj({
      map_name, 
      topic, 
      user_id, 
      is_visible, 
      template,
      file_path: fileUrl, 
      colors, 
      data_names, 
      data_values, 
      heat_range, 
      map_users_liked, 
      created_at
    });
    const savedMap = await newMap.save();

    // Respond with success message
    res.json({ success: true, message: 'Map created successfully!' });
  } catch (error) {
    console.error('Error creating map:', error);
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
    const url = map.file_path
    const urlParts = new URL(url);
    const filename = path.basename(urlParts.pathname);
    const file = bucket.file(filename);

    file.delete()
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

module.exports = {
  getMaps: getMaps,
  getMap: getMap,
  createMap: createMap,
  removeMap: removeMap
};