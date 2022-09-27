import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export default function handler(req, res) {
  // //Request to get the user's profile information
  // const access_token =
  //   getCookie('access_token_deezer', { req, res }) || req.body.access_token;
  // const authOptions = {
  //   method: 'GET',
  // };
  // const params = new URLSearchParams([['access_token', access_token]]);
  // const url = 'https://api.deezer.com/user/me?' + params.toString();
  // fetch(url, authOptions)
  //   .then((response) => {
  //     if (response.status === 200) {
  //       return response.json();
  //     } else {
  //       throw new Error(
  //         JSON.stringify({
  //           status: response.status,
  //           statusText: response.statusText,
  //         })
  //       );
  //     }
  //   })
  //   .then((jsonResponse) => {
  //     let access_token = jsonResponse.access_token;
  //     setCookie('access_token_deezer', access_token, {
  //       req,
  //       res,
  //       maxAge: 3600,
  //       httpOnly: true,
  //     });
  //     res.status(200).json({
  //       access_token_deezer: access_token,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err.message,
  //     });
  //   });
  res.status(500).json({ error: 'Not implemented' });
}
