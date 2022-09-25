//Request to add items to playlist
//URI type -> https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids
export default function handler(req, res) {
  const access_token =
    getCookie('access_token_deezer', { req, res }) || req.body.access_token;
  const playlist_id = req.body.playlist_id;
  const songs = req.body.songs; //1522223672, 1174603092

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
  fetch(url, options)
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
