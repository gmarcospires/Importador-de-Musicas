//Request to add items to playlist

import { getCookie } from 'cookies-next';

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const access_token =
    getCookie('access_token_deezer', { req, res }) || body.access_token;
  const playlist_id = body.playlist_id;
  const songs = body.uris; //1522223672, 1174603092

  const options = {
    method: 'POST',
  };
  const params = new URLSearchParams([
    ['access_token', access_token],
    ['songs', [songs]],
  ]);

  const url =
    `https://api.deezer.com/playlist/${playlist_id}/tracks?` +
    params.toString();
  const resposta = await fetch(url, options)
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
      return jsonResponse;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
  res.status(200).json(resposta);
}
