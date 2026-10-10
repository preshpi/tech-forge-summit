import { createHmac } from 'node:crypto';
import { questionClientIdentity } from '@/lib/questions/ingress';

export function gameClientIdentity(headers: Headers, mode: string | undefined, trustedHeader: string | undefined, secret: string | undefined) {
  if (!secret || secret.length < 32 || secret.startsWith('YOUR_')) return null;
  let ip = questionClientIdentity(headers, mode, trustedHeader);
  if (!ip) return null;
  if (ip.includes(':')) {
    // Collapse equivalent IPv6 spellings, including IPv4-mapped IPv6 addresses.
    ip = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
    const mapped = /^::ffff:([0-9a-f]+):([0-9a-f]+)$/.exec(ip);
    if (mapped) {
      const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
      ip = [high >> 8, high & 255, low >> 8, low & 255].join('.');
    }
  }
  return createHmac('sha256', secret).update(`spin-game-ip:v1:${ip}`).digest('hex');
}
