var app_id = process.env.APP_ID;
var secret = process.env.SECRET;
var redirect_uri = process.env.REDIRECT_URI_DEEZER;
var stateKey = 'deezer_auth_state';

module.exports = { app_id, secret, redirect_uri, stateKey };
