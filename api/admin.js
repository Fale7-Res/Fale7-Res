import { views } from '../lib/views.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (req.cookies.auth === 'loggedIn') {
    res.status(200).send(views.admin());
  } else {
    res.redirect(302, '/api/login');
  }
}
