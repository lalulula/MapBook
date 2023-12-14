const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// UTILS
const auth = require("./middleware/auth.js");

// IMPORTED ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const socialRoutes = require("./routes/social");
const socialCommentRoutes = require("./routes/socialComment");
const socialCommentReplyRoutes = require("./routes/socialPostReply.js");
const mapRoutes = require("./routes/map.js");
const mapCommentRoutes = require("./routes/mapComment.js");
const mapReplyRoutes = require("./routes/mapReply.js");


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
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const fileUpload = multer({ storage: multer.memoryStorage() });

// ROUTES WITH FILES
// UPDATE A USER
app.put(
  "/api/users/:id",
  upload.single("image"),
  auth.verifyToken,
  userController.updateUser
);
// Create Post
app.put(
  "/api/social/createSocialPost",
  upload.array("post_images"),
  socialController.createPost
);


// CREATE MAP
app.post(
  "/api/map/createMap",
  // fileUpload.single("file"),
  fileUpload.fields([{name: 'file'}, {name: 'mapPreviewImg'}]),

  
  // auth.verifyToken,
  mapController.createMap
);
// UPDATE MAP
app.put(
  "/api/maps/:mapId",
  fileUpload.fields([{name: 'file'}, {name: 'mapPreviewImg'}]),
  // auth.verifyToken,
  mapController.editMap
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/socialComment", socialCommentRoutes);
app.use("/api/socialCommentReply", socialCommentReplyRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/mapComment", mapCommentRoutes);
app.use("/api/mapReply", mapReplyRoutes);


// MONGOOSE SETUP
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
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
