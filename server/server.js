
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// // CONFIGURATIONS
// dotenv.config();

// const app = require("./app");


// // MONGOOSE SET UP


// const PORT = process.env.PORT || 3001;

// const start = () => {
//   mongoose
//     .connect(process.env.MONGO_URL, {
//     })
//     .then(() => {
//       app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     })
//     .catch((error) => console.log(`${error} did not connect`));
// };

// start()

const dotenv = require("dotenv");
const mongoose = require("mongoose");

// CONFIGURATIONS
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URL, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

// const start = (PORT) => {
//   try {
//     app.listen(PORT, () => {
//       console.log(`Api running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error(err);
//     process.exit();
//   }
// };

// start(PORT);