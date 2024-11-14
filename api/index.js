const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);
const secret = "yourFixedSecretKey";

//mongodb database password: X4eD35qRcSiL5FOG
//mongodb database username: buddhikan410

//mongodb+srv://buddhikan410:X4eD35qRcSiL5FOG@cluster0.3kudr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

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
      return res.status(400).json("user not found");
    }
  
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) return res.status(500).json("Server error");
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" }).json("ok");
      });
    } else {
      res.status(400).json("password incorrect");
    }
  });
  
  app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
  
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.json(info);
    });
  });

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
