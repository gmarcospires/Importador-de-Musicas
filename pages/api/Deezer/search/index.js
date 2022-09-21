//Search
//https://developers.deezer.com/api/search
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }

  const access_token = req.body.access_token;
  const query = req.body.query; // track:'easy on me' artist:'adele'
  const type = req.body.type; //artist, album, track, playlist, radio, podcast, episode
  const offset = req.body.offset || 0;
  const limit = req.body.limit || 20;

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
