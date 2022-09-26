import { getCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const body = JSON.parse(req.body);
  const access_token =
    getCookie('access_token_deezer', { req, res }) || body.access_token;
  const playlist_id = body.playlist_id;
  const offset = body.offset || 0;
  const limit = body.limit || 20;

  const options = {
    method: 'GET',
  };
  const params = new URLSearchParams([
    ['index', offset],
    ['limit', limit],
    ['access_token', access_token],
  ]);

  const url =
    `https://api.deezer.com/playlist/${playlist_id}/tracks?` +
    params.toString();
    
  fetch(url, options)
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
      return res.status(200).json(jsonResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
