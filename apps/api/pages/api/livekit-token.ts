import { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { room, identity } = req.query;
  if (!room || !identity) {
    return res.status(400).json({ error: 'Missing room or identity' });
  }
  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'LiveKit API credentials not set' });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: identity as string,
  });
  at.addGrant({
    room: room as string,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await at.toJwt();
  console.log('Generated JWT:', jwt);
  res.status(200).json({ token: jwt });
}
