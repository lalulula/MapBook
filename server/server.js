const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth")
const app = require("./app")

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