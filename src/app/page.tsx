"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const eventDate = new Date("2026-01-11T08:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 uppercase md:justify-between md:bg-transparent">
        <motion.div
          className="absolute top-4 right-4 md:top-8 md:right-8 z-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
        >
          {/* Hamburger Menu Icon with Dropdown */}
          <div className="relative">
            {/* 3 Horizontal Lines Icon */}
            <button 
              onClick={toggleMenu}
              className="text-white hover:text-yellow-400 transition-colors duration-200 p-3 md:p-2 touch-manipulation"
              aria-label="Toggle menu"
            >
              <div className="w-7 h-6 md:w-6 md:h-5 relative">
                {/* Hamburger Lines */}
                <div className={`absolute w-full h-0.5 bg-current rounded transition-all duration-300 transform ${
                  isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5 -translate-y-1/2'
                }`}></div>
                <div className={`absolute w-full h-0.5 bg-current rounded transition-all duration-300 transform ${
                  isMenuOpen ? 'top-1/2 -translate-y-1/2 opacity-0' : 'top-1/2 -translate-y-1/2'
                }`}></div>
                <div className={`absolute w-full h-0.5 bg-current rounded transition-all duration-300 transform ${
                  isMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[calc(100%-2px)] -translate-y-1/2'
                }`}></div>
              </div>
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 md:w-56 bg-transparent backdrop-blur-sm rounded-lg"
              >
                <div className="py-2">
                  {[
                    { href: "/gallery", label: "Thư viện ảnh" },
                    { href: "/faq", label: "Hỏi đáp" },
                    { href: "/contact", label: "Liên lạc & Kết nối" },
                    { href: "/donation", label: "Quyên góp" },
                    { href: "/admin/dashboard", label: "Quản trị" }
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center justify-end px-4 py-3 md:py-2 text-white hover:bg-white/20 hover:text-yellow-400 transition-colors duration-150 rounded mx-2 text-right text-sm md:text-base touch-manipulation"
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        <div className="mt-14 md:mt-20">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-center text-white mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
              Hành trình 20 năm
            </h1>
            <p className="text-xl md:text-2xl tracking-wide text-yellow-100 max-w-4xl mx-auto leading-relaxed">
              Từ ngôi trường mang tên Lê Hồng Phong, chúng ta trở lại nơi từng ghi dấu những ngày thanh xuân tươi đẹp...
            </p>
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
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>ngày</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0)) && (
                    <>
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>giờ</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  {((timeLeft.days > 0) || (timeLeft.hours > 0) || (timeLeft.minutes > 0)) && (
                    <>
                      <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>phút</div>
                      <div style={{ width: '1.5rem' }}></div>
                    </>
                  )}
                  <div className="text-xs font-legalese text-center" style={{ width: '3.5rem' }}>giây</div>
                </div>
                {!(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                    className="text-center mt-4"
                  >
                    <Link
                      href="/register"
                      className="group inline-flex items-center text-2xl font-semibold text-yellow-400 transition-colors hover:text-yellow-300"
                    >
                      <motion.span
                        whileHover={{ scale: 1.08, filter: "brightness(1.2)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-block"
                      >
                        Đăng ký ngay
                      </motion.span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6 animate-nudgeRight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                )}
              </div>
            </h1>
          </motion.div>
        </div>
      </main>
  );
}
