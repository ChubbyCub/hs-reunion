"use client";

import MusicPlayer from "@/components/MusicPlayer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicPlayer />
      {children}
    </>
  );
}
