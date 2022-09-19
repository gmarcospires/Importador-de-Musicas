// Secret environment variables that must be set
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI_SPOTIFY;
const stateKey = "spotify_auth_state";

module.exports = { client_id, client_secret, redirect_uri, stateKey };
