const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const app = require("./app");

// CONFIGURATIONS
dotenv.config();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
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
