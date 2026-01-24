"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAppStore } from "@/stores/app-store";
import { FileText, Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import confetti from "canvas-confetti";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const eventDate = useMemo(() => new Date("2026-02-01T08:00:00"), []);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { reset } = useAppStore();
  const confettiTriggered = useRef(false);

  // Music player state for inline player
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Clear the store when user visits homepage
    reset();

    // Check night mode on mount
    const currentHour = new Date().getHours();
    const nightMode = !(currentHour >= 6 && currentHour < 18);
    setIsNightMode(nightMode);

    // Detect if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Mark as mounted to show background
    setMounted(true);

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [reset]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = 0.3; // 30% volume

    // Handle audio end - loop the music
    const handleEnded = () => {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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

      // Check if registration should be shown
      // Show from 12:00 PM Jan 24, 2026 to 12:00 PM Jan 25, 2026 (Vietnam time)
      const registrationOpenDate = new Date("2026-01-24T12:00:00+07:00"); // 12 PM Jan 24
      const registrationCloseDate = new Date("2026-01-25T12:00:00+07:00"); // 12 PM Jan 25

      // Check for day/night mode (6 AM to 6 PM is day, otherwise night)
      const currentHour = now.getHours();
      const isDayTime = currentHour >= 6 && currentHour < 18;
      const nightMode = !isDayTime;
      setIsNightMode(nightMode);

      if (now >= registrationOpenDate && now < registrationCloseDate) {
        setShowRegistration(true);
      } else {
        setShowRegistration(false);

        // Trigger animation once when registration closes
        // This triggers when we're OUTSIDE the registration window (button is hidden)
        if (!confettiTriggered.current && now >= registrationCloseDate) {
          confettiTriggered.current = true;

          const duration = 5 * 1000; // 5 seconds
          const animationEnd = Date.now() + duration;

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }

          if (nightMode) {
            // Fireworks animation for night mode
            function launchFirework(x: number) {
              // Step 1: Shoot thin trail upward from bottom (like a beam)
              const trailEnd = randomInRange(0.2, 0.4); // y position where it explodes

              confetti({
                particleCount: 1,
                angle: 90,
                spread: 1,
                startVelocity: 70,
                decay: 0.91,
                gravity: 2.5,
                drift: 0,
                ticks: 60,
                origin: { x, y: 1 },
                colors: ['#FFFFFF'],
                shapes: ['circle'],
                scalar: 0.4,
                zIndex: 0
              });

              // Step 2: Explosion burst after delay
              setTimeout(() => {
                // Main colorful burst
                confetti({
                  particleCount: 100,
                  spread: 360,
                  startVelocity: 35,
                  decay: 0.9,
                  gravity: 1.2,
                  drift: randomInRange(-0.5, 0.5),
                  ticks: 200,
                  origin: { x, y: trailEnd },
                  colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FFFF00', '#FF1493', '#00FF00'],
                  shapes: ['circle', 'square'],
                  scalar: 1,
                  zIndex: 0
                });

                // Inner bright flash
                confetti({
                  particleCount: 30,
                  spread: 100,
                  startVelocity: 15,
                  decay: 0.95,
                  gravity: 0.5,
                  ticks: 100,
                  origin: { x, y: trailEnd },
                  colors: ['#FFFFFF', '#FFFF00'],
                  shapes: ['circle'],
                  scalar: 1.5,
                  zIndex: 0
                });

                // Glitter effect - delayed
                setTimeout(() => {
                  confetti({
                    particleCount: 40,
                    spread: 360,
                    startVelocity: 10,
                    decay: 0.94,
                    gravity: 0.8,
                    ticks: 150,
                    origin: { x, y: trailEnd },
                    colors: ['#FFD700', '#FFFFFF', '#FFA500'],
                    shapes: ['circle'],
                    scalar: 0.5,
                    zIndex: 0
                  });
                }, 200);
              }, 500); // Wait for trail to reach the top
            }

            // Launch multiple fireworks
            let fireworkCount = 0;
            const maxFireworks = 12;
            const interval: NodeJS.Timeout = setInterval(function() {
              if (fireworkCount >= maxFireworks) {
                clearInterval(interval);
                return;
              }

              // Launch 1-2 fireworks at a time from bottom
              const numLaunches = Math.random() > 0.6 ? 2 : 1;
              for (let i = 0; i < numLaunches; i++) {
                const x = randomInRange(0.2, 0.8);
                launchFirework(x);
                fireworkCount++;
              }
            }, 600);
          } else {
            // Confetti animation for day mode
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const interval: NodeJS.Timeout = setInterval(function() {
              const timeLeft = animationEnd - Date.now();

              if (timeLeft <= 0) {
                clearInterval(interval);
                return;
              }

              const particleCount = 50 * (timeLeft / duration);

              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
              });
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
              });
            }, 250);
          }
        }
      }
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
      <main
        data-homepage
        className="flex min-h-screen flex-col items-center justify-center p-24 uppercase md:justify-between"
        style={{
          backgroundImage: mounted
            ? isNightMode
              ? (isMobile ? 'url(/background_mobile_night.png)' : 'url(/background_desktop_night.png)')
              : (isMobile ? 'url(/background-mobile.webp)' : 'url(/background-desktop.webp)')
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: mounted ? 'transparent' : '#1a1a2e'
        }}
      >
        {/* Logos Container - Centered on all screen sizes */}
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 md:gap-1">
          {/* School Logo */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
          >
            <Image
              src="/school-logo.png"
              alt="School Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              priority
            />
          </motion.div>

          {/* 20 Nam Logo */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } }
            }}
          >
            <Image
              src="/logo-20-nam.png"
              alt="20 Nam Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Hamburger Menu */}
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
        <div className="mt-8 md:mt-24">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-center text-white mb-6"
          >
            {!showRegistration ? (
              // Show this message after registration closes (after midnight Jan 15)
              <>
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-4 txt-with-bg pad-02em blk-txt">
                  Cảm ơn bạn đã bắt máy Cuộc gọi Thanh xuân #Reply0306!
                </h1><br />
                <p className="text-xl md:text-2xl tracking-wide text-yellow-100 max-w-4xl mx-auto leading-relaxed txt-with-bg pad-02em blk-txt">
                  BTC xin thông báo:<br />
                  Cổng đăng ký đã chính thức đóng.<br />
                  Hẹn gặp bạn ngày 01/02/2026 tại sân trường Lê Hồng Phong nhé 💙
                </p>
              </>
            ) : (
              // Show original message before registration closes
              <>
                <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4 txt-with-bg pad-02em blk-txt">
                  Hành trình 20 năm
                </h1><br />
                <p className="text-2xl md:text-3xl font-semibold tracking-wide text-yellow-400 mb-3 txt-with-bg pad-02em blk-txt">
                  Ngày 1 tháng 2 năm 2026
                </p><br />
                <p className="text-xl md:text-2xl tracking-wide text-yellow-100 max-w-4xl mx-auto leading-relaxed txt-with-bg pad-02em blk-txt">
                  Từ ngôi trường mang tên Lê Hồng Phong, chúng ta trở lại nơi từng ghi dấu những ngày thanh xuân tươi đẹp...
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            className="my-8 text-center text-white md:my-0"
          >
            <h1 className="text-6xl md:text-8xl font-title">
              <div className="flex flex-col items-center mt-4">
                <div className="flex justify-center items-end txt-with-bg">
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
                <div className="flex justify-center items-start mt-1 txt-with-bg">
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
                    className="text-center mt-4 space-y-8"
                  >
                    {/* Xem Thư Ngỏ Button */}
                    <a
                      href="https://drive.google.com/file/d/1bX5ecaMj5Azb901-4LGva_D9LLt_bzpM/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-xl font-bold text-blue-400 transition-all hover:text-blue-500 border-0 md:border-2 md:border-white md:hover:border-blue-100 bg-black/30 hover:bg-black/40 px-6 py-3 rounded-lg"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-flex items-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Xem Thư Ngỏ
                      </motion.span>
                    </a>

                    {/* Đăng Ký Button - Only show if registration is open */}
                    {showRegistration ? (
                      <div>
                        <Link
                          href="/register"
                          className="group inline-flex items-center text-2xl font-bold text-yellow-400 transition-all hover:text-yellow-500 border-0 md:border-2 md:border-white md:hover:border-yellow-100 bg-transparent reg-cta-bg px-6 py-3 rounded-lg"
                        >
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="inline-block"
                          >
                            Đăng ký ngay
                          </motion.span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-6 w-6 animate-nudgeRight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    ) : (
                      /* Music Player - Show when registration is closed */
                      <div className="flex flex-col items-center gap-4 mt-24">
                        <audio ref={audioRef} src="https://pfbfasmmkpkdmojj.public.blob.vercel-storage.com/background-music-playlist.mp3" preload="auto" />

                        <div className="relative flex items-center gap-3">
                          {/* Animated music notes */}
                          {isPlaying && (
                            <>
                              <motion.div
                                animate={{
                                  y: [0, -15, 0],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="absolute -left-12 top-0"
                              >
                                <Music className="w-6 h-6 text-yellow-400" />
                              </motion.div>
                              <motion.div
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0.4, 1, 0.4]
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.3
                                }}
                                className="absolute -left-8 -top-2"
                              >
                                <Music className="w-5 h-5 text-yellow-300" />
                              </motion.div>
                              <motion.div
                                animate={{
                                  y: [0, -15, 0],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.6
                                }}
                                className="absolute -right-12 top-0"
                              >
                                <Music className="w-6 h-6 text-yellow-400" />
                              </motion.div>
                              <motion.div
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0.4, 1, 0.4]
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.9
                                }}
                                className="absolute -right-8 -top-2"
                              >
                                <Music className="w-5 h-5 text-yellow-300" />
                              </motion.div>
                            </>
                          )}

                          {/* Play/Pause Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg flex items-center justify-center transition-colors duration-200"
                            aria-label={isPlaying ? 'Pause music' : 'Play music'}
                          >
                            <AnimatePresence mode="wait">
                              {isPlaying ? (
                                <motion.div
                                  key="pause"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Pause className="w-7 h-7" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="play"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Play className="w-7 h-7 ml-1" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>

                          {/* Mute Button - Only show when playing */}
                          <AnimatePresence>
                            {isPlaying && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMute}
                                className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg flex items-center justify-center transition-colors duration-200"
                                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                              >
                                {isMuted ? (
                                  <VolumeX className="w-5 h-5" />
                                ) : (
                                  <Volume2 className="w-5 h-5" />
                                )}
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </h1>
          </motion.div>
        </div>
      </main>
  );
}
