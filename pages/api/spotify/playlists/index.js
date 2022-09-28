import { getCookie, deleteCookie, setCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const body = JSON.parse(req.body);
  let access_token =
    getCookie('access_token_spotify', { req, res }) || body.access_token;
  const offset = body.offset || 0;
  const limit = body.limit || 20;

  // if (!access_token) {
  //   fetch('api/spotify/refresh_token', { method: 'get' })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       } else {
  //         throw new Error(
  //           JSON.stringify({
  //             status: response.status,
  //             statusText: response.statusText,
  //           })
  //         );
  //       }
  //     })
  //     .then((jsonResponse) => {
  //       access_token = jsonResponse.access_token;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return res.status(401).json({
  //         error: err.message,
  //       });
  //     });
  // }

  const options = {
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
    method: 'GET',
  };
  const params = new URLSearchParams([
    ['offset', offset],
    ['limit', limit],
  ]);

  const url = 'https://api.spotify.com/v1/me/playlists?' + params.toString();
  const resposta = await fetch(url, options)
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
      return jsonResponse;
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status == 401 ? err.status : 500).json({
        error: err.message,
      });
    });

  res.status(200).json(resposta);
}
