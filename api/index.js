const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = bcrypt.genSaltSync(10);

//mongodb database password: X4eD35qRcSiL5FOG
//mongodb database username: buddhikan410

//mongodb+srv://buddhikan410:X4eD35qRcSiL5FOG@cluster0.3kudr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://buddhikan410:X4eD35qRcSiL5FOG@cluster0.3kudr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username: username });
  if (!userDoc) {
    res.status(400).json("user not found");
    return;
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json("ok");
    });
    //res.json('pass');
  } else {
    res.status(400).json("password incorrect");
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
