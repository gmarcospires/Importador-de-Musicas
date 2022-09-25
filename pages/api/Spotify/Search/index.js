//Search
//"track: easy on me artist:adele isrc:USSM12105970"
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }

  const access_token =
    getCookie('access_token', { req, res }) || req.body.access_token;
  const query = req.body.query;
  const type = req.body.type;
  const offset = req.body.offset || 0;
  const limit = req.body.limit || 20;

  const params = new URLSearchParams({
    q: query,
    type: type,
    limit: limit,
    offset: offset,
  });
  const authOptions = {
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };

  const url = 'https://api.spotify.com/v1/search?' + params.toString();
  fetch(url, authOptions)
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        res.status(200).json(jsonResponse);
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
      res.send(jsonResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
