const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const admin = require("firebase-admin");

// UTILS
const auth = require("./middleware/auth.js");
const serviceAccount = require('./mapbook-firebase.json');
const MapObj = require("./models/MapObj");

// IMPORTED ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const socialRoutes = require("./routes/social");
const socialCommentRoutes = require("./routes/socialComment");
const socialCommentReplyRoutes = require("./routes/socialPostReply.js");

// IMPORTED CONTROLLERS
const userController = require("./controllers/users");
const socialController = require("./controllers/social");
const mapController = require("./controllers/map");

const app = require("./app");

// CONFIGURATIONS
dotenv.config();

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// IMG FILE STORAGE
const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});

// INITIALIZE FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();

const fileUpload = multer({ storage: multer.memoryStorage() });


// ROUTES WITH FILES
app.put('/api/users/:id', upload.single('image'), auth.verifyToken, userController.updateUser);
// Create Post
app.put("/api/social/createSocialPost", upload.single('post_images'), socialController.createPost);
// CREATE MAP
app.post("/api/maps", fileUpload.single('file'), async (req, res) => {
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
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/socialComment", socialCommentRoutes);
app.use("/api/socialCommentReply", socialCommentReplyRoutes);


// MONGOOSE SETUP
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    }
  })
  .catch((error) => console.log(`${error} did not connect`));

//TEST///////////////////////////
// In-memory mock database (replace with your actual database)
const users = [{ username: "Jasson" }];

// Endpoint to check if a user with the given username exists
app.get("/api/checkUser/:username", (req, res) => {
  const { username } = req.params;
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    res.status(200).json({ userExists: true });
  } else {
    res.status(404).json({ userExists: false });
  }
});
//TEST-END////////////////////////////////
module.exports = app;
