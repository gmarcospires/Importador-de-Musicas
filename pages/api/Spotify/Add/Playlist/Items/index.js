//Request to add items to playlist
//URI type -> https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({
      error: "Invalid request method",
    });
  }
  const access_token = req.body.access_token;
  const playlist_id = req.body.playlist_id;
  const uris = req.body.uris;

  const authOptions = {
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      uris: [uris],
    }),
  };
  const url = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks";

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
