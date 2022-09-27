import { stateKey } from '../../../../js/deezer_auth.js';
import { deleteCookie } from 'cookies-next';

export default function handler(req, res) {
  deleteCookie('access_token_deezer', { req, res });
  deleteCookie('refresh_token_deezer', { req, res });
  deleteCookie(stateKey, { req, res });
  res.status(200).json({ message: 'Logged out' });
}
