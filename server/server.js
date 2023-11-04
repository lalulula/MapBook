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