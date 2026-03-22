'use client';

import { useEffect, useState } from 'react';

type Playlist = {
  id: string;
  name: string;
  image: string | null;
  trackCount: number;
  owner: string;
};

export default function Dashboard(){
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        fetch('/api/playlists')
        .then(res => res.json())
        .then(data => {
            setPlaylists(data.playlists);
        });
    }, []);

    return (
        <div className="">
            <h1 className="">Playlists Dashboard</h1>
            <div>
                {playlists.map(playlist => (
                    <button
                    key={playlist.id}
                    onClick={}>

                    </button>
                ))}
            </div>
        </div>
    )
}
