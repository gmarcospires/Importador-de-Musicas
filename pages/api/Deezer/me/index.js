export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const access_token = req.body.access_token;
  const authOptions = {
    method: 'GET',
  };
  const params = new URLSearchParams([['access_token', access_token]]);

  const url = 'https://api.deezer.com/user/me?' + params.toString();
  fetch(url, authOptions)
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
