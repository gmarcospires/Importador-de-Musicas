import { deleteCookie } from 'cookies-next';
import { stateKey } from '../../../../js/spotify_auth.js';

export default function handler(req, res) {
  deleteCookie('access_token', { req, res });
  deleteCookie('refresh_token', { req, res });
  deleteCookie(stateKey, { req, res });
  res.status(200).json({ message: 'Logged out' });
}
