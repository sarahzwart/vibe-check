import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const refreshAccessToken = async (userId: string): Promise<string | null> => {
  const { data: user } = await supabase
    .from('users')
    .select('refresh_token')
    .eq('id', userId)
    .single();

  if (!user?.refresh_token) {
    console.error('No refresh token found for user:', userId);
    return null;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.refresh_token,
    }).toString(),
  });

  if (!response.ok) {
    console.error('Failed to refresh token:', await response.text());
    return null;
  }

  const data = await response.json();
  const { access_token, expires_in } = data;

  await supabase
    .from('users')
    .update({
      access_token: access_token,
      token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
    })
    .eq('id', userId);

  return access_token;
};

export const getValidAccessToken = async (userId: string): Promise<string | null> => {
  const { data: user } = await supabase
    .from('users')
    .select('access_token, token_expires_at')
    .eq('id', userId)
    .single();

  if (!user) return null;

  const expiresAt = new Date(user.token_expires_at).getTime();
  const fiveMinutes = 5 * 60 * 1000;
  const isExpired = Date.now() > expiresAt - fiveMinutes;

  if (isExpired) {
    return await refreshAccessToken(userId);
  }

  return user.access_token;
};