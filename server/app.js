const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

const fakeDB = [
  {
    id: Math.floor(Math.random() * 100),
    email: "test@example.com",
  },
];

app.get("/", (req, res) => {
  return res.status(200).json({ data: fakeDB });
});

const register = async (req, res) => {
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
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

app.post("/api/auth/register", register)

app.post("/send", (req, res) => {
  fakeDB.push({
    id: Math.floor(Math.random() * 100),
    email: req.body.email,
  });
  return res.status(201).json({ data: fakeDB });
});

app.put("/update/:id", (req, res) => {
  const obj = fakeDB.find((el) => el.id === Number(req.params.id));
  obj.email = req.body.email;
  return res.status(200).json({ data: fakeDB });
});

app.delete("/destroy/:id", (req, res) => {
  const i = fakeDB.findIndex((el) => el.id === Number(req.params.id));
  fakeDB.splice(i, 1);
  return res.status(200).json({ data: fakeDB });
});

module.exports = app;