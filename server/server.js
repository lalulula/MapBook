import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
// import path from "path";
import { fileURLToPath } from "url";
import * as auth from "./auth.js";
import User from "./models/User.js"

// CONFIGURATIONS

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());


app.get('/api/auth/login', function(req, res) {
    // TODO: make response as json format
    res.send("return code: " + auth.login(req.query.id, req.query.pw));
});


export const register = async (req, res) => {

    try {
        const {
        username,
        password,
        } = req.body;
        const newUser = new User({
        username,
        password,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

app.post("/api/auth/register", register);


// MONGOOSE SET UP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
