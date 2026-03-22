import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.redirect(new URL('/', request.url));

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        }).toString(),
    });

    if (!tokenResponse.ok) {
        console.error('Failed to get token:', await tokenResponse.text());
        return NextResponse.redirect(new URL('/', request.url));
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileResponse.ok) {
        console.error('Failed to get profile:', await profileResponse.text());
        return NextResponse.redirect(new URL('/', request.url));
    }

    const profile = await profileResponse.json();

    const { data: user, error } = await supabase
        .from('users')
        .upsert(
        {
            spotify_id: profile.id,
            display_name: profile.display_name,
            email: profile.email,
            avatar_url: profile.images?.[0]?.url ?? null,
            access_token: access_token,
            refresh_token: refresh_token,
            token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        },
        { 
            onConflict: 'spotify_id' 
        }
        )
        .select()
        .single();

    if (error || !user) {
        console.error('Supabase error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    response.cookies.set('user_id', user.id, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
}