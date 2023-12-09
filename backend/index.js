
require('dotenv').config();
console.log('Environment variables:', process.env);
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
  "playlist-modify-private",
  "user-read-private",
  "user-top-read",
];

const MOODS = {
  '0': 'sad',
  '0.1': "somber",
  '0.2': "depressed",
  '0.3': "melancholy",
  '0.4': "calm",
  '0.5': "neutral",
  '0.6': "excited",
  '0.7': "happy",
  '0.8': "joyful",
  '0.9': "euphoric",
  '1': "blissful",
};

const SCOPES_URL_PARAM = SCOPES.join("%20");
app.get("/login", (req, res) => {
  try {
    const loginUrl = `${process.env.SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    console.log(loginUrl);
    res.redirect(loginUrl);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/recommendations", async (req, res) => {
  try {
    const { accessToken, targetValence } = req.query;

    const topTracks = await getTopItems(accessToken, "tracks", 2);
    const seedTracks = await getItemSeed(topTracks.items);
    const topArtists = await getTopItems(accessToken, "artists", 3);
    const seedArtists = await getItemSeed(topArtists.items);

    const recommendedData = await getRecommendations(
      accessToken,
      seedArtists,
      seedTracks,
      targetValence
    );
    const recommendedTracks = getRecommendedTracks(recommendedData);

    const userInfo = await getUserID(accessToken);

    // console.log("target valence",targetValence)
    // console.log(MOODS[targetValence])

    const playlist = await createPlaylist(
      accessToken,
      userInfo.id,
      `your ${MOODS[targetValence]} playlist`,
      targetValence
    );
    addTracksToPlaylist(accessToken, playlist.id, recommendedTracks);

    res.json(playlist);
  } catch (error) {
    console.error("Error during results:", error);
    res.status(500).send("Internal Server Error");
  }
});

const createPlaylist = async (accessToken, userID, playlistName, valence) => {
  const CREATE_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${userID}/playlists`;
  console.log("CREATE_PLAYLIST_ENDPOINT");
  console.log(CREATE_PLAYLIST_ENDPOINT);
  const response = await axios.post(
    CREATE_PLAYLIST_ENDPOINT,
    {
      name: playlistName,
      description: `Created by MoodTunes with a target valence of ${valence}`,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

const addTracksToPlaylist = async (accessToken, playlistID, tracks) => {
  const ADD_TRACKS_TO_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

  const trackURIs = tracks.map((track) => track.uri);
  console.log("trackURIs");
  console.log(trackURIs);

  try {
    const response = await axios.post(
      ADD_TRACKS_TO_PLAYLIST_ENDPOINT,
      {
        uris: trackURIs,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Successfully added tracks to the playlist:", response.data);
  } catch (error) {
    console.error("Error adding tracks to the playlist:", error.message);
    throw error;
  }
};

const getRecommendedTracks = (recommendations) => {
  return recommendations.tracks.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    uri: track.uri,
  }));
};

const getTopItems = async (accessToken, type, limit) => {
  const USER_TOP_IEMS_ENDPOINT = `https://api.spotify.com/v1/me/top/${type}?limit=${limit}`;
  const response = await axios.get(USER_TOP_IEMS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const getItemSeed = async (items) => {
  const itemSeeds = items.map((item) => item.id);
  const result = itemSeeds.join(",");
  return result;
};

const getRecommendations = async (
  accessToken,
  seedArtists,
  seedTracks,
  targetValence
) => {
  const RECOMMENDATIONS_ENDPOINT = "https://api.spotify.com/v1/recommendations";
  const response = await axios.get(RECOMMENDATIONS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      seed_artists: seedArtists,
      seed_tracks: seedTracks,
      target_valence: targetValence,
    },
  });
  return response.data;
};

const getUserID = async (accessToken) => {
  const USER_INFO_ENDPOINT = "https://api.spotify.com/v1/me";
  const response = await axios.get(USER_INFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
