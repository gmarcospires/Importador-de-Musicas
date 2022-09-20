export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({
      error: "Invalid request method",
    });
  }
  const access_token = req.body.access_token;
  const user_id = req.body.user_id;
  const name = req.body.playlist_name;
  const is_public = req.body.is_public || true;
  const collaborative = req.body.is_collaborative || false;
  const description = req.body.playlist_description || "";

  const options = {
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      public: is_public,
      collaborative: collaborative,
      description: description,
    }),
  };

  const url = "https://api.spotify.com/v1/users/" + user_id + "/playlists";
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