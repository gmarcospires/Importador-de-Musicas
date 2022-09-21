import { generateRandomString } from '../../../../js/func.js';
import { app_id, redirect_uri, stateKey } from '../../../../js/deezer_auth.js';
import { setCookie } from 'cookies-next';

const permissions = [
  'basic_access',
  'manage_library',
  'delete_library',
  'listening_history',
  'offline_access',
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Invalid request method',
    });
  }

  let state = generateRandomString(16);
  setCookie(stateKey, state, {
    req,
    res,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  const params = new URLSearchParams([
    ['app_id', app_id],
    ['perms', permissions],
    ['redirect_uri', redirect_uri],
    ['state', state],
  ]);

  res.redirect(
    'https://connect.deezer.com/oauth/auth.php?' + params.toString()
  );
}
