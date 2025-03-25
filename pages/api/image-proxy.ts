// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || Array.isArray(url)) {
    return res.status(400).send('URL parameter required');
  }

  try {
    const response = await fetch(url as string, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept':
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    }

    const buffer = await response.arrayBuffer();
    res.setHeader(
      'Content-Type',
      response.headers.get('Content-Type') || 'image/jpeg'
    );
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send('Server error');
  }
}
