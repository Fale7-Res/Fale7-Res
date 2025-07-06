import { views } from '../lib/views.js';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).send(views.login({ error: null }));
  } else if (req.method === 'POST') {
    if (req.body.password === 'fale71961') {
      res.setHeader('Set-Cookie', 'auth=loggedIn; Path=/; HttpOnly; SameSite=Strict');
      res.redirect(302, '/api/admin');
    } else {
      res.status(200).send(views.login({ error: 'كلمة المرور غير صحيحة' }));
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
