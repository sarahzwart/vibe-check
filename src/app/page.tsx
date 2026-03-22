import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-2">Vibe Check</h1>
      <p className="text-zinc-400 mb-8">See how much your friends would like your playlist</p>
      <a
        href="/api/auth/login"
        className="bg-pink-500 hover:bg-pink-400 text-black font-semibold px-8 py-3 rounded-full transition"
      >
        Login with Spotify
      </a>
    </main>
  );
}
