import { generateRandomString } from "../../../../js/func.js";
import {
  client_id,
  redirect_uri,
  stateKey,
} from "../../../../js/spotify_auth.js";

const scope = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(400).json({
      error: "Invalid request method",
    });
  }
  let state = generateRandomString(16);
  res.cookie(stateKey, state, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  const params = new URLSearchParams([
    ["response_type", "code"],
    ["client_id", client_id],
    ["scope", scope],
    ["redirect_uri", redirect_uri],
    ["state", state],
  ]);
  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
}
