import { client_id } from '../../../js/spotify_auth.js';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  // requesting access token from refresh token
  const buffer = new Buffer.from(
    client_id + ':' + client_secret,
    'utf8'
  ).toString('base64');
  var refresh_token = req.query.refresh_token;

  const params = new URLSearchParams([
    ['refresh_token', refresh_token],
    ['grant_type', 'refresh_token'],
  ]);
  var options = {
    body: params,
    headers: {
      Authorization: 'Basic ' + buffer,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
  };

  fetch('https://accounts.spotify.com/api/token', options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
          })
        );
      }
    })
    .then((jsonResponse) => {
      let access_token = jsonResponse.access_token;
      setCookie('access_token', access_token, {
        req,
        res,
        maxAge: 3600,
        httpOnly: true,
      });
      res.status(200).json({
        access_token: access_token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
