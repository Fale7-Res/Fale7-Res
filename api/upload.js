import { put } from '@vercel/blob';
import cookie from 'cookie';
import formidable from 'formidable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

  if (cookies.auth !== 'loggedIn') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const form = formidable({ multiples: false });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.menu?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const buffer = await new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.readFile(file.filepath, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });

    const { url } = await put('menu.pdf', buffer, { access: 'public' });
    res.status(200).json({ success: true, message: 'Menu uploaded.', url });
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    res.status(500).json({ success: false, message: 'Error uploading menu.' });
  }
}
