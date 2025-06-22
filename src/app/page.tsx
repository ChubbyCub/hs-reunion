"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { CountdownRenderProps } from "react-countdown";

const Countdown = dynamic(() => import("react-countdown"), { ssr: false });

// Renderer for the countdown component
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) {
    // Render a completed state
    return (
      <div className="text-center">
        <h2 className="text-5xl font-bold">The reunion is happening!</h2>
      </div>
    );
  } else {
    // Render a countdown
    return (
      <div className="text-center">
        <h2 className="text-2xl font-light uppercase tracking-widest text-gray-700">
          Reunion Starts In
        </h2>
        <div className="mt-4 flex justify-center space-x-4">
          {days > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold">{String(days).padStart(2, "0")}</span>
              <span className="text-lg font-light">Days</span>
            </div>
          )}
          {days < 1 && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold">{String(hours).padStart(2, "0")}</span>
                <span className="text-lg font-light">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold">{String(minutes).padStart(2, "0")}</span>
                <span className="text-lg font-light">Minutes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold">{String(seconds).padStart(2, "0")}</span>
                <span className="text-lg font-light">Seconds</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default function Home() {
  const reunionDate = new Date("2026-01-11T08:00:00");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-24 text-gray-800">
      <div className="w-full max-w-4xl text-center">
        <Countdown date={reunionDate} renderer={CountdownRenderer} />
        <div className="mt-12">
          <Link
            href="/register"
            className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            Register Now
          </Link>
        </div>
      </div>
    </main>
  );
}
