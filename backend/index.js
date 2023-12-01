require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const SCOPES = [
  "playlist-modify-public",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
];

const SCOPES_URL_PARAM = SCOPES.join("%20");
app.get("/login", (req, res) => {
  try {
    const loginUrl = `${process.env.SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    // console.log(loginUrl);
    res.redirect(loginUrl);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update", (req, res) => {
  try {
    console.log("update");
    res.send("update");
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
