import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/spotify';

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
        return NextResponse.json({ error: 'Could not get access token' }, { status: 401 });
    }
    
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        method: 'GET',
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        console.error('Spotify error:', await response.text());
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }

    const data = await response.json();
    const playlists = data.items.map((p: any) => ({
        id: p.id,                          
        name: p.name,                      
        image: p.images?.[0]?.url ?? null, 
        trackCount: p.tracks.total,        
        owner: p.owner.display_name,       
    }));

    return NextResponse.json({ playlists });
}