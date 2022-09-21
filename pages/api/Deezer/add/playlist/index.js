export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const access_token = req.body.access_token;
  const user_id = req.body.user_id;
  const title = req.body.playlist_name;
  const is_public = req.body.is_public || true;
  const collaborative = req.body.is_collaborative || false;
  const description = req.body.playlist_description || '';

  const options = {
    method: 'POST',
  };
  const params = new URLSearchParams([
    ['access_token', access_token],
    ['title', title],
    ['public', is_public],
    ['collaborative', collaborative],
    ['description', description],
  ]);

  const url =
    `https://api.deezer.com/user/${user_id}/playlists?` + params.toString();
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
