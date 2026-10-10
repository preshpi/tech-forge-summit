/** Supabase secret API keys belong in apikey; only legacy JWT keys use Bearer. */
export function gameServiceHeaders(service: string): Record<string, string> {
  return {
    apikey: service,
    ...(service.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${service}` }),
    'Content-Type': 'application/json',
  };
}
