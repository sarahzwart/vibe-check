import { NextResponse } from 'next/server';

// https://developer.spotify.com/documentation/web-api/concepts/scopes

// user-read-private - Read access to user’s subscription details (type of user account).
// user-read-email - Read access to user’s email address.
// user-top-read - Read access to a user's top artists and tracks.
// user-library-read - Read access to a user's library.
// playlist-read-private - 	Read access to user's private playlists.
// playlist-read-collaborative - Includes collaborative playlists when requesting a user's playlists.

const scopes = 'user-read-private user-read-email user-top-read user-library-read playlist-read-private playlist-read-collaborative';

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  });

// redirect user's browser to Spotify's login page
  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params}`
  );
}