import { client_id, client_secret } from '../../../../js/spotify_auth.js';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export default async function handler(req, res) {
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
  var refresh_token =
    req.query.refresh_token || getCookie('refresh_token', { req, res });

  const params = new URLSearchParams([
    ['refresh_token', refresh_token + '65465465'],
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

  const resposta = await fetch(
    'https://accounts.spotify.com/api/token',
    options
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 400) {
          deleteCookie('access_token', { req, res });
          deleteCookie('refresh_token', { req, res });
        }
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
      const expires_in = jsonResponse.expires_in;
      console.log('REFRESH TOKEN');

      setCookie('access_token', access_token, {
        req,
        res,
        maxAge: expires_in,
        httpOnly: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });

  res.status(200).json(resposta);
}
