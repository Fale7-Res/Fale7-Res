import { list } from '@vercel/blob';
import { views } from '../lib/views.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { blobs } = await list();
    const menuBlob = blobs.find(blob => blob.pathname === 'menu.pdf');
    const menuExists = !!menuBlob;
    const menuUrl = menuBlob ? `${menuBlob.url}?v=${Date.now()}` : '';

    res.status(200).send(views.menu({ menuExists, menuUrl }));
  } catch (error) {
    console.error('Error checking Blob:', error);
    res.status(200).send(views.menu({ menuExists: false, menuUrl: '' }));
  }
}
