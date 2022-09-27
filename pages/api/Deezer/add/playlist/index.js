import { getCookie } from 'cookies-next';
// TODO - Public e Collaborative
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }
  const body = JSON.parse(req.body);
  const access_token =
    getCookie('access_token_deezer', { req, res }) || body.access_token;

  const user_id = body.user_id;
  const title = body.playlist_name;
  const is_public = body.is_public === undefined ? true : body.is_public;
  const collaborative =
    body.is_collaborative === undefined ? false : body.is_collaborative;
  const description = body.description || '';

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
  const resposta = await fetch(url, options)
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
      return jsonResponse;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });

  res.status(200).json(resposta);
}
