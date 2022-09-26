import { getCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const access_token =
    getCookie('access_token', { req, res }) || req.body.access_token;
  const authOptions = {
    headers: {
      Authorization: 'Bearer ' + access_token,
      limit: '50',
    },
    method: 'GET',
  };

  fetch('https://api.spotify.com/v1/me', authOptions)
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
      console.log(jsonResponse);
      res.status(200).json(jsonResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
}
