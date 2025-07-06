import { del, list } from '@vercel/blob';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

  if (cookies.auth !== 'loggedIn') {
    return res.redirect(302, '/api/login');
  }

  try {
    const { blobs } = await list();
    const menuBlob = blobs.find(blob => blob.pathname === 'menu.pdf');
    if (menuBlob) {
      await del(menuBlob.url);
      res.status(200).json({ success: true, message: 'Menu deleted.' });
    } else {
      res.status(200).json({ success: true, message: 'Menu already deleted.' });
    }
  } catch (error) {
    console.error('Error deleting from Blob:', error);
    res.status(500).json({ success: false, message: 'Error deleting menu.' });
  }
}
