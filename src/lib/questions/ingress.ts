import { isIP } from 'node:net';

export function questionClientIdentity(headers: Headers, mode: string | undefined, configuredHeader: string | undefined) {
 // Local development has no trusted ingress. All requests share the persistent development bucket.
 if (mode === 'development') return 'local-development';
 const header = configuredHeader?.trim();
 if (!header || header.startsWith('YOUR_') || !/^[a-zA-Z0-9-]+$/.test(header)) return null;
 // The operator must configure a header overwritten by the hosting ingress.
 const ip = headers.get(header)?.split(',')[0].trim();
 return ip && isIP(ip) ? ip : null;
}
