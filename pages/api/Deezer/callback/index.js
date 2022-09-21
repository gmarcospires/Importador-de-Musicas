import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { app_id, secret, stateKey } from '../../../../js/deezer_auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  // your application requests refresh and access tokens
  // after checking the state parameter
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = getCookie(stateKey, { req, res });

  if (state === null || state !== storedState) {
    res.status(500).json({ error: 'state_mismatch' });
  } else {
    deleteCookie(stateKey, { req, res });
    const params = new URLSearchParams([
      ['app_id', app_id],
      ['secret', secret],
      ['code', code],
      ['output', 'json'],
    ]);
    const authOptions = {
      method: 'GET',
    };
    const url =
      'https://connect.deezer.com/oauth/access_token.php?' + params.toString();
    fetch(url, authOptions)
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
        var access_token = jsonResponse.access_token;
        var refresh_token = jsonResponse.refresh_token;
        // var expires_token = jsonResponse.expires;

        setCookie('access_token_deezer', access_token, {
          req,
          res,
          maxAge: 3600,
          httpOnly: true,
        });

        setCookie('refresh_token_deezer', refresh_token, {
          req,
          res,
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
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
