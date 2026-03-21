import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// https://supabase.com/docs/guides/api/api-keys


export async function GET(request: NextRequest) {
    // https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-access-token
    const res = await fetch('', {
    method: 'POST',
    headers: {
      
    },
    body: 
  });

  const data = await res.json();

}