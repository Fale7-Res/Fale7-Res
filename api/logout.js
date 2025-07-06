export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', 'auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  res.redirect(302, '/api/login');
}
