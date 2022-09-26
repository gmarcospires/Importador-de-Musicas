import { getCookie } from 'cookies-next';

//TODO - public and colaborative options
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }

  const body = JSON.parse(req.body);
  let access_token =
    getCookie('access_token', { req, res }) || body.access_token;
  const user_id = body.user_id;
  const name = body.playlist_name;
  const is_public = body.is_public === undefined ? true : body.is_public;
  const collaborative =
    body.is_collaborative === undefined ? false : body.is_collaborative;
  const description = body.description || '';

  if (!access_token) {
    fetch('api/spotify/refresh_token', { method: 'get' })
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
        access_token = jsonResponse.access_token;
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({
          error: err.message,
        });
      });
  }

  const options = {
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      name: name,
      public: is_public,
      collaborative: collaborative,
      description: description,
    }),
  };

  const url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists';
  console.log(options);
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
