const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const auth = require("./controllers/auth")
const authRoutes = require("./routes/auth")

// EXPRESS APP SETUP
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

// CONFIGURATIONS
dotenv.config();

// ROUTES
app.use("/api/auth", authRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

module.exports = app;