//Search
//https://developers.deezer.com/api/search
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
  const query = body.query; // track:'easy on me' artist:'adele'
  const type = body.type; //artist, album, track, playlist, radio, podcast, episode
  const offset = body.offset || 0;
  const limit = body.limit || 20;

  const params = new URLSearchParams({
    q: query,
    type: type,
    limit: limit,
    offset: offset,
  });
  var authOptions = {
    method: 'GET',
  };

  const url = `https://api.deezer.com/search/${type}?` + params.toString();
  fetch(url, authOptions)
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
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
      res.status(200).json(jsonResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
