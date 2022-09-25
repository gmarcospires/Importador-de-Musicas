//Search
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }

  const access_token =
    getCookie('access_token_deezer', { req, res }) || req.body.access_token;
  const track_id = req.body.track_id;
  const offset = req.body.offset || 0;
  const limit = req.body.limit || 20;

  const options = {
    method: 'GET',
  };
  const params = new URLSearchParams([
    ['offset', offset],
    ['limit', limit],
    ['access_token', access_token],
  ]);

  const url = `https://api.deezer.com/track/${track_id}?` + params.toString();
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
      res.status(200).json(jsonResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
