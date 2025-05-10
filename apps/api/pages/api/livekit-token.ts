import { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
    canPublish: false,
    canSubscribe: true,
  });

  res.status(200).json({ token: at.toJwt() });
}
