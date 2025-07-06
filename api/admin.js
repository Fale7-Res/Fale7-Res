import { views } from '../lib/views.js';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Parse cookies from the request headers
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

  if (cookies.auth === 'loggedIn') {
    res.status(200).send(views.admin());
  } else {
    res.redirect(302, '/api/login');
  }
}
