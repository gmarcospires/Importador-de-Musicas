import {
  client_id,
  redirect_uri,
  client_secret,
  stateKey,
} from '../../../../js/spotify_auth.js';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export default function handler(req, res) {
  console.log('aqui');

  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = getCookie(stateKey, { req, res });
  if (state === null || state !== storedState) {
    res.status(500).json({ error: 'state_mismatch' });
  } else {
    deleteCookie(stateKey, { req, res });
    const buffer = new Buffer.from(
      client_id + ':' + client_secret,
      'utf8'
    ).toString('base64');
    const params = new URLSearchParams([
      ['code', code],
      ['redirect_uri', redirect_uri],
      ['grant_type', 'authorization_code'],
    ]);

    const authOptions = {
      body: params,
      headers: {
        Authorization: 'Basic ' + buffer,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      method: 'POST',
    };

    fetch('https://accounts.spotify.com/api/token', authOptions)
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
        let refresh_token = jsonResponse.refresh_token;

        setCookie('access_token', access_token, {
          req,
          res,
          maxAge: 3600,
        });

        setCookie('refresh_token', refresh_token, {
          req,
          res,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect('/inicio');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err.message,
        });
      });
  }
}
