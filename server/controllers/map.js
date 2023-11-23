const MapObj = require("../models/MapObj");

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

module.exports = {
  createMap: createMap
};