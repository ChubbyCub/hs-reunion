"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {useTranslations} from 'next-intl';
import { useEffect, useState } from "react";

export default function Home() {
  const t = useTranslations("HomePage");
  const eventDate = new Date("2026-01-11T08:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 uppercase md:justify-between md:bg-transparent">
        <motion.div
          className="absolute top-8 right-8 flex flex-col gap-3 z-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {[
            { href: "/gallery", label: "Gallery", className: "" },
            { href: "/faq", label: "FAQ", className: "" },
            { href: "/admin/dashboard", label: "Admin", className: "hidden md:block" }
          ].map((item) => (
            <motion.div
              key={item.href}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
              <Link
                href={item.href}
                className={`text-white text-lg font-semibold transition-colors hover:text-yellow-400 ${item.className}`}
                style={{ display: item.className?.includes('hidden') ? undefined : 'block' }}
              >
                <motion.span
                  whileHover={{ scale: 1.08, filter: "brightness(1.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-block"
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-center text-white"
          >
            <p className="text-3xl tracking-wide">{t("title")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            className="my-8 text-center text-white md:my-0"
          >
            <h1 className="text-6xl md:text-8xl font-title">
              <div className="flex flex-col items-center mt-4">
                <div className="flex justify-center items-end">
                  {timeLeft.days > 0 && (
                    <>
                      <div className="flex flex-col items-center" style={{ width: '3.5rem' }}>
                        <span className="text-4xl font-title leading-none">{timeLeft.days}</span>
                      </div>
                      <div className="flex flex-col items-center" style={{ width: '1.5rem' }}>
                        <span className="text-4xl font-title leading-none">:</span>
                      </div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0)) && (
                    <>
                      <div className="flex flex-col items-center" style={{ width: '3.5rem' }}>
                        <span className="text-4xl font-title leading-none">{timeLeft.hours}</span>
                      </div>
                      <div className="flex flex-col items-center" style={{ width: '1.5rem' }}>
                        <span className="text-4xl font-title leading-none">:</span>
                      </div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0) || (timeLeft.minutes > 0)) && (
                    <>
                      <div className="flex flex-col items-center" style={{ width: '3.5rem' }}>
                        <span className="text-4xl font-title leading-none">{timeLeft.minutes}</span>
                      </div>
                      <div className="flex flex-col items-center" style={{ width: '1.5rem' }}>
                        <span className="text-4xl font-title leading-none">:</span>
                      </div>
                    </>
                  )}
                  <div className="flex flex-col items-center" style={{ width: '3.5rem' }}>
                    <span className="text-4xl font-title leading-none">{timeLeft.seconds}</span>
                  </div>
                </div>
                <div className="flex justify-center items-start mt-1">
                  {timeLeft.days > 0 && (
                    <>
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>days</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0)) && (
                    <>
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>hours</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0) || (timeLeft.minutes > 0)) && (
                    <>
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>minutes</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>seconds</div>
                </div>
              </div>
            </h1>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
          className="text-center"
        >
          <Link href="/register" className="group inline-flex items-center text-2xl font-semibold text-yellow-400 transition-colors hover:text-yellow-300">
            {t("registerNow")}
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6 animate-nudgeRight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </main>
  );
}
