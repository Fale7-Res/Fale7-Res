import { put } from '@vercel/blob';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

  if (cookies.auth !== 'loggedIn') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const file = req.files?.menu;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { url } = await put('menu.pdf', file.data, { access: 'public' });
    res.status(200).json({ success: true, message: 'Menu uploaded.', url });
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    res.status(500).json({ success: false, message: 'Error uploading menu.' });
  }
}
