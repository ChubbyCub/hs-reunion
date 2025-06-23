"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations("HomePage");
  return (
      <main className="flex font-geist-mono min-h-screen flex-col items-center justify-center bg-black/40 p-24 uppercase md:justify-between md:bg-transparent">
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
          <h1 className="text-8xl font-bold">202</h1>
          <p className="text-lg">{t("days")}</p>
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
