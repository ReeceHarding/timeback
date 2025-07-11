"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Pacifico } from "next/font/google"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { StreamVideo } from '@/components/ui/stream-video'

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

function BookShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-blue-500/[0.12]",
  bookColor = "blue",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
  bookColor?: "blue" | "gray" | "purple" | "green"
}) {
  // Book aspect ratio and 3D depth calculations
  const bookHeight = height
  const bookWidth = height * 0.7 // Books are typically taller than wide
  const bookDepth = bookWidth * 0.15 // Book thickness
  
  const colorVariants = {
    blue: {
      cover: "from-blue-600/20 to-blue-800/10",
      spine: "from-blue-700/25 to-blue-900/15",
      pages: "from-white/[0.08] to-gray-200/[0.05]"
    },
    gray: {
      cover: "from-gray-600/15 to-gray-800/10",
      spine: "from-gray-700/20 to-gray-900/12",
      pages: "from-white/[0.06] to-gray-200/[0.04]"
    },
    purple: {
      cover: "from-purple-600/15 to-purple-800/10",
      spine: "from-purple-700/20 to-purple-900/12",
      pages: "from-white/[0.07] to-gray-200/[0.05]"
    },
    green: {
      cover: "from-emerald-600/15 to-emerald-800/10",
      spine: "from-emerald-700/20 to-emerald-900/12",
      pages: "from-white/[0.06] to-gray-200/[0.04]"
    }
  }
  
  const colors = colorVariants[bookColor]
  
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
        rotateY: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
        rotateY: 0,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotateY: [-5, 5, -5],
          rotateZ: [rotate - 2, rotate + 2, rotate - 2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width: bookWidth,
          height: bookHeight,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Book Cover (Front) */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br",
            colors.cover,
            "backdrop-blur-[2px] border border-white/[0.12]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]",
          )}
          style={{
            transform: `translateZ(${bookDepth / 2}px)`,
          }}
        >
          {/* Subtle book title line */}
          <div className="absolute top-[20%] left-[15%] right-[15%] h-[2px] bg-white/[0.08]" />
          <div className="absolute top-[30%] left-[20%] right-[20%] h-[1px] bg-white/[0.05]" />
        </div>
        
        {/* Book Spine */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0",
            "bg-gradient-to-b",
            colors.spine,
            "backdrop-blur-[2px] border-l border-white/[0.15]",
            "shadow-[-4px_0_20px_0_rgba(0,0,0,0.1)]",
          )}
          style={{
            width: `${bookDepth}px`,
            transform: `rotateY(-90deg) translateZ(${bookDepth / 2}px)`,
            transformOrigin: "right center",
          }}
        >
          {/* Spine detail lines */}
          <div className="absolute top-[15%] bottom-[15%] left-[40%] w-[1px] bg-white/[0.1]" />
          <div className="absolute top-[15%] bottom-[15%] right-[40%] w-[1px] bg-white/[0.1]" />
        </div>
        
        {/* Book Pages (Right side) */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0",
            "bg-gradient-to-l",
            colors.pages,
            "backdrop-blur-[1px]",
          )}
          style={{
            width: `${bookDepth}px`,
            transform: `rotateY(90deg) translateZ(${bookWidth - bookDepth / 2}px)`,
            transformOrigin: "left center",
          }}
        >
          {/* Page texture lines */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 bg-gray-400/[0.02]"
              style={{
                left: `${i * 20}%`,
                width: "1px",
              }}
            />
          ))}
        </div>
        
        {/* Book Back Cover */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br",
            colors.cover,
            "backdrop-blur-[2px] border border-white/[0.10]",
            "shadow-[0_4px_16px_0_rgba(0,0,0,0.08)]",
          )}
          style={{
            transform: `translateZ(-${bookDepth / 2}px) rotateY(180deg)`,
          }}
        />
        
        {/* Top edge of pages */}
        <div
          className={cn(
            "absolute left-0 right-0 top-0",
            "bg-gradient-to-b",
            colors.pages,
            "backdrop-blur-[1px]",
          )}
          style={{
            height: `${bookDepth}px`,
            transform: `rotateX(90deg) translateZ(${bookDepth / 2}px)`,
            transformOrigin: "center bottom",
          }}
        />
        
        {/* Bottom edge of pages */}
        <div
          className={cn(
            "absolute left-0 right-0 bottom-0",
            "bg-gradient-to-t",
            colors.pages,
            "backdrop-blur-[1px]",
          )}
          style={{
            height: `${bookDepth}px`,
            transform: `rotateX(-90deg) translateZ(${bookDepth / 2}px)`,
            transformOrigin: "center top",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}



function LogoCarousel() {
  const clientId = "81EV4Ai5NPPSSYR1aEHnpIebmWp108KzHvxvTNLoPw8="
  
  const logos = [
    {
      name: "Wall Street Journal",
      url: "https://www.wsj.com/opinion/make-america-smart-again-technology-ai-students-education-schools-policy-5ffcc497",
      logo: `https://cdn.brandfetch.io/wsj.com?c=${clientId}`,
      domain: "wsj.com",
    },
    {
      name: "USA Today",
      url: "https://www.usatoday.com/story/tech/2024/05/19/ai-use-in-education/73737400007/",
      logo: `https://cdn.brandfetch.io/usatoday.com?c=${clientId}`,
      domain: "usatoday.com",
    },
    {
      name: "Forbes",
      url: "https://www.forbes.com/councils/forbestechcouncil/2025/03/21/the-future-of-learning-balancing-good-and-bad-screen-time/",
      logo: `https://cdn.brandfetch.io/forbes.com?c=${clientId}`,
      domain: "forbes.com",
    },
    {
      name: "Newsweek",
      url: "https://www.newsweek.com/alpha-school-brownsville-ai-expanding-2063669",
      logo: `https://cdn.brandfetch.io/newsweek.com?c=${clientId}`,
      domain: "newsweek.com",
    },
    {
      name: "NewsNation",
      url: "https://www.newsnationnow.com/business/tech/ai/inside-texas-alpha-school-ai-teach/",
      logo: `https://cdn.brandfetch.io/newsnationnow.com?c=${clientId}`,
      domain: "newsnationnow.com",
    },
    {
      name: "NBC News",
      url: "https://youtube.com/watch?v=WIXJrdjG8RY&pp=0gcJCdgAo7VqN5tD",
      logo: `https://cdn.brandfetch.io/nbcnews.com?c=${clientId}`,
      domain: "nbcnews.com",
    },
    {
      name: "Business Insider",
      url: "https://www.businessinsider.com/adaptive-learning-technology-helping-teachers-students-close-achievement-gap-2024-9",
      logo: `https://cdn.brandfetch.io/businessinsider.com?c=${clientId}`,
      domain: "businessinsider.com",
    },
    {
      name: "Dr. Phil",
      url: "https://www.youtube.com/watch?v=GNwcU5Velgs",
      logo: `https://cdn.brandfetch.io/drphil.com?c=${clientId}`,
      domain: "drphil.com",
    },
    {
      name: "Fox News",
      url: "https://www.foxnews.com/media/texas-private-schools-use-ai-tutor-rockets-student-test-scores-top-2-country",
      logo: `https://cdn.brandfetch.io/foxnews.com?c=${clientId}`,
      domain: "foxnews.com",
    },
    {
      name: "Yahoo News",
      url: "https://www.yahoo.com/news/could-ai-replace-american-workers-200010195.html",
      logo: `https://cdn.brandfetch.io/yahoo.com?c=${clientId}`,
      domain: "yahoo.com",
    },
  ]

  // Triple the logos for seamless infinite scroll
  const tripleLogos = [...logos, ...logos, ...logos]

  return (
    <div className="hidden md:block relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-light text-white/60 text-center tracking-wide"
        >
          Major Media Covers Our Schools
        </motion.h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex">
          <motion.div
            data-carousel-container
            className="flex gap-8 md:gap-12 lg:gap-16 items-center"
            animate={{
              x: [0, `-${100 / 3}%`],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            style={{
              width: "300%",
            }}
          >
            {tripleLogos.map((publication, index) => (
              <motion.a
                key={`${publication.name}-${index}`}
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center justify-center h-12 md:h-16 px-6 md:px-8 lg:px-10 cursor-pointer group min-w-[120px] md:min-w-[140px] lg:min-w-[160px]"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                onHoverStart={() => {
                  // Pause the parent animation
                  const parentElement = document.querySelector("[data-carousel-container]")
                  if (parentElement) {
                    ;(parentElement as HTMLElement).style.animationPlayState = "paused"
                  }
                }}
                onHoverEnd={() => {
                  // Resume the parent animation
                  const parentElement = document.querySelector("[data-carousel-container]")
                  if (parentElement) {
                    ;(parentElement as HTMLElement).style.animationPlayState = "running"
                  }
                }}
              >
                <div className="relative w-32 md:w-40 lg:w-48 h-12 md:h-16 flex items-center justify-center">
                  <Image
                    src={publication.logo}
                    alt={publication.name}
                    fill
                    className="object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                  />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  )
}

function AnimatedCounter({
  from,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  inView,
}: {
  from: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
  inView: boolean
}) {
  const [count, setCount] = useState(from)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Skip animation on mobile - directly show final value
    if (isMobile) {
      setCount(to)
      return
    }
    
    if (!inView) return

    const timer = setTimeout(() => {
      let start = from
      const increment = (to - from) / (duration * 60) // 60fps

      const counter = setInterval(() => {
        start += increment
        if ((increment > 0 && start >= to) || (increment < 0 && start <= to)) {
          setCount(to)
          clearInterval(counter)
        } else {
          setCount(Math.round(start))
        }
      }, 1000 / 60)

      return () => clearInterval(counter)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [inView, from, to, duration, delay, isMobile])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}



// Mobile Collapsible Section Component
function MobileCollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = "",
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  // Always open on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true)
    } else {
      setIsOpen(defaultOpen)
    }
  }, [isMobile, defaultOpen])
  
  if (!isMobile) {
    // On desktop, just render the children without collapsible wrapper
    return <div className={className}>{children}</div>
  }
  
  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <h4 className="text-lg font-medium text-white/80">{title}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/40"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default function HeroGeometric({
  badge = "Kids Master Twice the Material in Half the Time",
  title1 = "Kids Learn 2x More",
  title2 = "In Just 2 Hours a Day",
  subtitle = "We built AI tutors that give each student personal attention. It works.",
}: {
  badge?: string
  title1?: string
  title2?: string
  subtitle?: string
}) {
  const isMobile = useIsMobile()
  const [specialCasesOpenIndex, setSpecialCasesOpenIndex] = useState<string | null>(null)
  const [scienceOpenIndex, setScienceOpenIndex] = useState<string | null>(null)
  
  // Log the props received
  console.log(`[HeroGeometric ${new Date().toISOString()}] Props received:`, {
    badge,
    title1,
    title2,
    subtitle
  })
  
  // Log white paper section added
  console.log(`[HeroGeometric ${new Date().toISOString()}] White paper CTA added to data section`)
  
  // Log subtitle update to facts format
  console.log(`[HeroGeometric ${new Date().toISOString()}] Subtitle updated to facts format: ${subtitle}`)
  
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  }
  
  // Helper function to conditionally apply animations (disabled on mobile except for hero)
  const getMobileAwareAnimationProps = (isHeroSection: boolean = false) => {
    if (isMobile && !isHeroSection) {
      // Return static props for mobile (no animation)
      return {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 }
      }
    }
    // Return normal animation props
    return {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#000000]">
      {/* Hero Section */}
      <div className="relative min-h-screen h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-gray-500/[0.02] blur-3xl" />

        <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none">
          <BookShape
            delay={0.3}
            height={180}
            rotate={12}
            bookColor="blue"
            className="hidden sm:block absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />

          <BookShape
            delay={0.5}
            height={150}
            rotate={-15}
            bookColor="gray"
            className="absolute right-[-5%] md:right-[0%] top-[70%] md:top-[75%] scale-50 sm:scale-100"
          />

          <BookShape
            delay={0.4}
            height={100}
            rotate={-8}
            bookColor="purple"
            className="absolute left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] scale-50 sm:scale-100"
          />

          <BookShape
            delay={0.6}
            height={80}
            rotate={20}
            bookColor="green"
            className="hidden sm:block absolute right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />

          <BookShape
            delay={0.7}
            height={60}
            rotate={-25}
            bookColor="blue"
            className="hidden sm:block absolute left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4 sm:mb-6 md:mb-12"
            >
              <span className="text-xs sm:text-sm text-white/60 tracking-wide">{badge}</span>
            </motion.div>

            <motion.div 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.1] sm:leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  {title1}
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  {title2}
                </span>
              </h1>
            </motion.div>

            <motion.div 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible"
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/40 mb-6 sm:mb-8 leading-[1.4] sm:leading-relaxed font-light tracking-wide max-w-lg sm:max-w-2xl mx-auto">
                {subtitle}
              </p>
            </motion.div>

            <motion.div 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible"
              transition={{ delay: 1.1 }}
            >
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg sm:max-w-3xl mx-auto">
                <button
                  onClick={() => document.getElementById("what-is-timeback")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border border-white/20 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-white/5 hover:border-blue-400/40 transition-all duration-200 whitespace-nowrap"
                >
                  See How It Works
                </button>
                <button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border border-white/20 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-white/5 hover:border-blue-400/40 transition-all duration-200 whitespace-nowrap"
                >
                  Read the Science
                </button>
                <button
                  onClick={() => document.getElementById("the-proof")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border border-white/20 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-white/5 hover:border-blue-400/40 transition-all duration-200 whitespace-nowrap"
                >
                  See the Data
                </button>
                <button
                  onClick={() => document.getElementById("join-waitlist")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-600 transition-all duration-200 whitespace-nowrap"
                >
                  Join the Movement
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/80 pointer-events-none" />
      </div>



      {/* The Bold Claim Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-gray-500/[0.01] blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  Sound Too Good to Be True?
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-2xl mx-auto">
                We get it. Learning twice as much in two hours sounds impossible. 
                Here's why it's not.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="text-3xl font-bold text-blue-400 mb-4">30:1</div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">Classroom Reality</h3>
                <p className="text-white/60 text-sm">
                  One teacher. 30 kids. Each student gets 1/30th of the attention. 
                  Most time is wasted waiting.
                </p>
              </motion.div>

              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="text-3xl font-bold text-blue-400 mb-4">1:1</div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">TimeBack Reality</h3>
                <p className="text-white/60 text-sm">
                  Every kid gets a personal AI tutor. Full attention. 
                  Zero waiting. Pure learning.
                </p>
              </motion.div>

              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="text-3xl font-bold text-blue-400 mb-4">2σ</div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">Proven Science</h3>
                <p className="text-white/60 text-sm">
                  Bloom proved it in 1984. One on one tutoring creates 
                  2 sigma improvement. We made it scalable.
                </p>
              </motion.div>
            </div>

            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl max-w-3xl mx-auto"
            >
              <p className="text-blue-300 text-base font-medium text-center">
                The math is simple: Remove the waste. Add personal attention. Watch kids soar.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What is TimeBack Section */}
      <div className="relative py-16 md:py-32 overflow-hidden" id="what-is-timeback">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-gray-500/[0.01] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <BookShape
            delay={1.0}
            height={120}
            rotate={-10}
            bookColor="blue"
            className="left-[-5%] top-[20%]"
          />

          <BookShape
            delay={1.2}
            height={90}
            rotate={15}
            bookColor="gray"
            className="right-[-3%] bottom-[30%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  What is TimeBack?
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
                TimeBack is an AI powered Education Operating System that gives students hours of their day back. 
                Our kids learn 2.47x faster in just 2 hours instead of 6.
              </p>
            </motion.div>

            {/* Core Technology Overview */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-8"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6">The AI Systems That Make It Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">StudyReel™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      "Smart Coaching, Faster Learning" - Like game film for learning. An AI coach watches students work and provides instant, personalized guidance.
                    </p>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">PowerPath™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Navigates curriculum at optimal speed using learning science and mastery standards. Each student moves at their perfect pace.
                    </p>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">StruggleDetector™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      AI identifies when a student is struggling and provides additional help before frustration sets in.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Incept™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      AI content generator that tailors lessons to student interests. Makes learning compelling by connecting to what kids care about.
                    </p>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">SPARKme™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Built-in motivational system with clear daily/weekly/monthly goals, progress visualization, and rewards that keep kids engaged.
                    </p>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">MentorMojis™</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Customizable AI tutor avatars that make learning approachable and fun. Kids design their own personal AI teacher.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How It All Works Together */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="space-y-4"
            >
              {/* Time Transformation */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'time-transformation' ? null : 'time-transformation')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">How We Give Kids Their Time Back</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'time-transformation' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'time-transformation' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'time-transformation' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      Students start their day with a full academic schedule. As they complete morning lessons with AI tutors, 
                      afternoon blocks transform from academics to "workshop time" - pursuing passions, building projects, being kids.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-blue-300 font-semibold mb-2">Traditional School Day</h5>
                          <p className="text-white/50 text-sm">6-7 hours of classes + homework</p>
                        </div>
                        <div>
                          <h5 className="text-blue-300 font-semibold mb-2">TimeBack Day</h5>
                          <p className="text-white/50 text-sm">2 hours focused learning + free time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Real Time AI Coaching */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'ai-coaching' ? null : 'ai-coaching')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Always On Personal AI Tutoring</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'ai-coaching' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'ai-coaching' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'ai-coaching' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="space-y-4">
                      <p className="text-white/60 text-sm leading-relaxed">
                        StudyReel watches every student work in real time. Like having a world class tutor sitting next to each kid, 
                        providing instant feedback, catching mistakes immediately, and adjusting difficulty on the fly.
                      </p>
                      <ul className="space-y-2 text-white/60 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">▸</span>
                          <span>Watches screen activity to understand exactly where students struggle</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">▸</span>
                          <span>Provides coaching on how to use learning apps correctly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">▸</span>
                          <span>Ensures academic integrity with AI proctoring</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">▸</span>
                          <span>Tracks time saved and celebrates efficiency gains</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Mastery-Based Learning */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'mastery-system' ? null : 'mastery-system')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">True Mastery, Not Time Based Learning</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'mastery-system' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'mastery-system' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'mastery-system' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="space-y-4">
                      <p className="text-white/60 text-sm leading-relaxed">
                        PowerPath ensures students truly understand each concept before moving forward. No more passing with 70% and 
                        missing 30% of the material. Students achieve Over 90% mastery at every level.
                      </p>
                      <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.05]">
                        <h5 className="text-white/80 font-semibold mb-2">The PowerPath 100 Score</h5>
                        <ul className="space-y-1 text-white/60 text-sm">
                          <li>• Progressive difficulty questions (4 levels)</li>
                          <li>• Deep question banks prevent memorization</li>
                          <li>• Questions harder than standardized tests</li>
                          <li>• Must demonstrate transfer of knowledge</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Personalized Content */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'personalized' ? null : 'personalized')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Learning About What They Love</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'personalized' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'personalized' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'personalized' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="space-y-4">
                      <p className="text-white/60 text-sm leading-relaxed">
                        Incept™ generates educational content tailored to each student's interests. Every textbook, lesson, 
                        and problem becomes personally compelling.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                          <p className="text-white/70 text-sm">
                            <span className="text-blue-400">Baseball fan?</span> Learn statistics through batting averages
                          </p>
                        </div>
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                          <p className="text-white/70 text-sm">
                            <span className="text-blue-400">Loves gaming?</span> Master fractions via game mechanics
                          </p>
                        </div>
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                          <p className="text-white/70 text-sm">
                            <span className="text-blue-400">Taylor Swift fan?</span> Study history through her song references
                          </p>
                        </div>
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                          <p className="text-white/70 text-sm">
                            <span className="text-blue-400">Into fantasy?</span> Learn writing through adventure stories
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* The Promise */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mt-12 p-6 md:p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl max-w-4xl mx-auto text-center"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-4">
                The Result: Happy Kids Who Excel
              </h3>
              <p className="text-white/70 text-base leading-relaxed mb-6">
                Over 90% of our students say they love school. They score in the 99th percentile nationally. 
                And they have time to be kids - playing sports, making art, building things, spending time with family.
              </p>
              <p className="text-blue-300 text-lg font-medium">
                This isn't the future of education. It's happening right now.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How TimeBack Works Section */}
      <div className="relative py-16 md:py-32 overflow-hidden" id="how-it-works">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-gray-500/[0.01] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <BookShape
            delay={1.1}
            height={130}
            rotate={-14}
            bookColor="purple"
            className="left-[-7%] top-[35%]"
          />

          <BookShape
            delay={1.3}
            height={95}
            rotate={20}
            bookColor="green"
            className="right-[-4%] bottom-[20%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  How TimeBack Works
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
                AI tutors watch students work. They catch mistakes instantly. They adjust lessons in real time. 
                Each kid gets personal coaching all day long.
              </p>
            </motion.div>

            {/* Introduction Video */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-8 max-w-4xl mx-auto"
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-black/50">
                <StreamVideo
                  videoKey="trimmedIntro"
                  localPath="/videos/trimmedIntro.mp4"
                  className="w-full h-full"
                  controls
                  onLoadStart={() => console.log(`[HeroGeometric ${new Date().toISOString()}] Introduction video loading started`)}
                  onCanPlay={() => console.log(`[HeroGeometric ${new Date().toISOString()}] Introduction video ready to play`)}
                  onError={(error) => console.error(`[HeroGeometric ${new Date().toISOString()}] Introduction video error:`, error)}
                />
              </div>
            </motion.div>

            {/* Implementation Details */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-8"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6">The Daily Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MobileCollapsibleSection title="Morning: 2 Hours of AI Powered Learning" defaultOpen={false}>
                  <ul className="space-y-3 text-white/60 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Personal AI Coach:</strong> Each student logs in to their personalized AI tutor that knows exactly where they left off.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Adaptive Lessons:</strong> Content automatically adjusts to each student's pace and understanding level.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Real Time Help:</strong> The moment a student struggles, AI provides hints, explanations, or easier problems.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Progress Tracking:</strong> Students see their achievements unlock in real time as they master concepts.</span>
                    </li>
                  </ul>
                </MobileCollapsibleSection>
                
                <MobileCollapsibleSection title="Afternoon: Time for Life" defaultOpen={false}>
                  <ul className="space-y-3 text-white/60 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Workshop Time:</strong> Build robots, create art, play sports, pursue passions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Social Learning:</strong> Collaborate on projects with friends who share interests.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Family Time:</strong> Actually have dinner together, help with chores, be part of the family.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span><strong className="text-white/80">Rest & Play:</strong> Time to be a kid - crucial for development and happiness.</span>
                    </li>
                  </ul>
                </MobileCollapsibleSection>
              </div>
            </motion.div>

            {/* Key Differentiators */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="space-y-4"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 text-center">What Makes TimeBack Different</h3>
              
              {/* Every Kid Starts Where They Are */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'start-where-you-are' ? null : 'start-where-you-are')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Every Kid Starts Where They Are</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'start-where-you-are' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'start-where-you-are' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'start-where-you-are' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-white/80 font-semibold mb-2">Behind in Reading?</h5>
                        <p className="text-white/60 text-sm">9th grader at 3rd grade level? Start at 3rd grade. Build confidence. Move up fast.</p>
                      </div>
                      <div>
                        <h5 className="text-white/80 font-semibold mb-2">Ahead in Math?</h5>
                        <p className="text-white/60 text-sm">4th grader doing 8th grade work? Keep going. No artificial limits.</p>
                      </div>
                      <div>
                        <h5 className="text-white/80 font-semibold mb-2">Learning English?</h5>
                        <p className="text-white/60 text-sm">Start at the right language level. Age doesn't determine placement.</p>
                      </div>
                      <div>
                        <h5 className="text-white/80 font-semibold mb-2">Mixed Abilities?</h5>
                        <p className="text-white/60 text-sm">Excel in math, work on reading. Each subject at its own pace.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* No Wasted Time */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'no-wasted-time' ? null : 'no-wasted-time')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Zero Wasted Minutes</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'no-wasted-time' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'no-wasted-time' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'no-wasted-time' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-white/80 font-semibold mb-3">Traditional Classroom Waste</h5>
                        <ul className="space-y-2 text-white/60 text-sm">
                          <li>• Waiting for 29 other students</li>
                          <li>• Repeating what you already know</li>
                          <li>• Moving at the class pace, not yours</li>
                          <li>• Transitions, attendance, disruptions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-white/80 font-semibold mb-3">TimeBack Efficiency</h5>
                        <ul className="space-y-2 text-white/60 text-sm">
                          <li>• Personal pace all the time</li>
                          <li>• Skip what you know</li>
                          <li>• Focus where you need help</li>
                          <li>• Pure learning, no interruptions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Proven Results */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'proven-results' ? null : 'proven-results')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Verified by Standardized Tests</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'proven-results' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'proven-results' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'proven-results' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      We don't guess. We test. Our students take the same standardized tests as everyone else - 
                      SAT, State tests, AP exams. They consistently score in the top percentiles.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-300 text-sm font-medium text-center">
                        Real tests. Real scores. Real proof that 2 hours beats 7.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The Science Behind TimeBack Section */}
      <div className="relative py-16 md:py-32 overflow-hidden" id="the-science">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-gray-500/[0.01] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <BookShape
            delay={1.0}
            height={100}
            rotate={22}
            bookColor="gray"
            className="left-[10%] top-[15%]"
          />

          <BookShape
            delay={1.2}
            height={80}
            rotate={-18}
            bookColor="purple"
            className="right-[5%] bottom-[25%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  Built Upon Decades of Learning Science
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
                In 1984, Benjamin Bloom proved one on one tutoring makes students learn 2x more. 
                We built the AI that delivers personal tutoring to every kid.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Left Column - Video */}
              <div>
                {/* Video Section */}
                <motion.div
                  {...getMobileAwareAnimationProps()}
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8"
                >
                  <h3 className="text-xl font-semibold text-white/90 mb-4">The Original Study (35 seconds)</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/50 mb-4">
                    <StreamVideo
                      videoKey="learningScience"
                      localPath="/videos/learningScience.mp4"
                      className="w-full h-full"
                      controls
                      onLoadStart={() => console.log(`[HeroGeometric ${new Date().toISOString()}] Learning science video loading started`)}
                      onCanPlay={() => console.log(`[HeroGeometric ${new Date().toISOString()}] Learning science video ready to play`)}
                      onError={(error) => console.error(`[HeroGeometric ${new Date().toISOString()}] Learning science video error:`, error)}
                    />
                  </div>
                  <a
                    href="https://www.jstor.org/stable/1175554"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                  >
                    Read Bloom's Original 1984 Study →
                  </a>
                </motion.div>
              </div>

              {/* Right Column - Technical Breakdown and TimeBack Implementation */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="space-y-6"
              >
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                  <MobileCollapsibleSection title="What 2 Sigma Means" defaultOpen={true}>
                    <p className="text-white/60 text-sm mb-4">
                      Bloom tested three groups. Classroom teaching. Mastery learning. One on one tutoring.
                      The tutored kids scored two standard deviations higher.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                        <div className="pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-white/10">
                          <p className="text-blue-400 text-xl sm:text-2xl font-bold mb-1">
                            50th → 98th
                          </p>
                          <p className="text-white/50 text-xs sm:text-sm mt-2">Percentile Jump</p>
                        </div>
                        <div className="pt-3 sm:pt-0">
                          <p className="text-blue-400 text-xl sm:text-2xl font-bold mb-1">2σ</p>
                          <p className="text-white/50 text-xs sm:text-sm mt-2">Standard Deviations</p>
                        </div>
                      </div>
                    </div>
                  </MobileCollapsibleSection>
                </div>

                {/* TimeBack's Implementation */}
                <motion.div
                  {...getMobileAwareAnimationProps()}
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6"
                >
                  <h4 className="text-lg font-semibold text-white/90 mb-3">We Built What Bloom Imagined</h4>
                  <p className="text-white/60 text-sm">
                    Bloom wanted every kid to have a personal tutor. We made it happen with AI. 
                    Our students hit the same 2σ improvement Bloom found in 1984.
                  </p>
                </motion.div>

              </motion.div>
            </div>

            {/* Science Dropdowns */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mt-12 space-y-4 max-w-4xl mx-auto"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6 text-center">Three More Breakthroughs Power Our System</h3>
              
              {/* Cognitive Load Optimization */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setScienceOpenIndex(scienceOpenIndex === 'cognitive-load' ? null : 'cognitive-load')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Cognitive Load Optimization</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: scienceOpenIndex === 'cognitive-load' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: scienceOpenIndex === 'cognitive-load' ? "auto" : 0,
                    opacity: scienceOpenIndex === 'cognitive-load' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4">
                      Too easy? Kids get bored. Too hard? Kids give up. Just right? Kids learn fast. 
                      Our AI keeps every lesson in the sweet spot. All day long.
                    </p>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-4 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                        <p className="text-sm md:text-base font-medium bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                          Cognitive Load: 85-95% optimal engagement
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://onlinelibrary.wiley.com/doi/epdf/10.1207/s15516709cog1202_4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                      Read Sweller's Cognitive Load Theory (1998) →
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Mastery Based Progression */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setScienceOpenIndex(scienceOpenIndex === 'mastery-based' ? null : 'mastery-based')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Mastery Based Progression</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: scienceOpenIndex === 'mastery-based' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: scienceOpenIndex === 'mastery-based' ? "auto" : 0,
                    opacity: scienceOpenIndex === 'mastery-based' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4">
                      Schools move by calendar. We move by mastery. Kids prove they know it (Over 90%) before moving on. 
                      No gaps. No holes. Just solid understanding.
                    </p>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-4 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                        <p className="text-sm md:text-base font-medium bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                          Mastery Threshold: ≥90% before progression
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/38423504/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                      Read Winget & Persky's Mastery Research →
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Zone of Proximal Development */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setScienceOpenIndex(scienceOpenIndex === 'zpd' ? null : 'zpd')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Zone of Proximal Development</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: scienceOpenIndex === 'zpd' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: scienceOpenIndex === 'zpd' ? "auto" : 0,
                    opacity: scienceOpenIndex === 'zpd' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4">
                      Vygotsky found the zone where kids learn fastest. Not what they know. Not what's impossible. 
                      Right in between. Our AI keeps kids there all day.
                    </p>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-4 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                        <p className="text-sm md:text-base font-medium bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                          Accuracy Target: 70-85% (optimal challenge)
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://files.eric.ed.gov/fulltext/EJ1081990.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                      Read about Vygotsky's ZPD (US Dept of Education 2010) →
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The Proof Section - The Numbers Don't Lie */}
      <div className="relative py-16 md:py-32 overflow-hidden" id="the-proof">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-gray-500/[0.01] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <BookShape
            delay={1.0}
            height={100}
            rotate={-12}
            bookColor="blue"
            className="left-[15%] top-[10%]"
          />

          <BookShape
            delay={1.2}
            height={80}
            rotate={18}
            bookColor="purple"
            className="right-[10%] bottom-[20%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mb-12 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  The Evidence We've Gathered
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
                Real students. Real progress. Ten years of data from Alpha School, independently verified by MAP, SAT, and AP testing.
              </p>
            </motion.div>

            {/* Top 3 Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8"
              >
                <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-4">99th</div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">National Percentile</h3>
                <p className="text-white/60 text-sm">Average student achievement on MAP testing</p>
              </motion.div>

              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8"
              >
                <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-4">2.47x</div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">Learning Velocity</h3>
                <p className="text-white/60 text-sm">Students progress through curriculum more efficiently</p>
              </motion.div>

              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8"
              >
                <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-4">1470+</div>
                <h3 className="text-xl font-semibold text-white/90 mb-2">Average SAT Score</h3>
                <p className="text-white/60 text-sm">High school graduates (National avg: 1028)</p>
              </motion.div>
            </div>

            {/* NEW: The Brownsville Miracle */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 mb-12"
            >
              <h3 className="text-2xl font-semibold text-white/90 mb-6">A Story from Brownsville: Hope for Every Community</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h4 className="text-lg font-medium text-white/80 mb-4">Math Progress</h4>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-3xl font-bold text-white/40">31st</div>
                    <svg width="40" height="20" viewBox="0 0 40 20" className="text-blue-400">
                      <path d="M5 10 L30 10 M25 5 L35 10 L25 15" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <div className="text-4xl font-bold text-blue-400">84th</div>
                  </div>
                  <p className="text-white/60 text-sm">percentile growth in one year</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-medium text-white/80 mb-4">Reading Progress</h4>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-3xl font-bold text-white/40">31st</div>
                    <svg width="40" height="20" viewBox="0 0 40 20" className="text-blue-400">
                      <path d="M5 10 L30 10 M25 5 L35 10 L25 15" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <div className="text-4xl font-bold text-blue-400">71st</div>
                  </div>
                  <p className="text-white/60 text-sm">percentile growth in one year</p>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-6 text-center">
                Brownsville is one of our most economically challenged districts. These results show that 
                <br />every child deserves access to personalized learning, regardless of their circumstances.
              </p>
            </motion.div>

            {/* Collapsible Sections */}
            <div className="space-y-4 mb-12">
              {/* NEW: The Time Paradox */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'time-paradox' ? null : 'time-paradox')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">The Time Paradox: Less Time, Better Results</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'time-paradox' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'time-paradox' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'time-paradox' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="bg-white/[0.02] rounded-xl p-4 mb-4">
                      <p className="text-white/80 font-medium mb-2">Average Daily Academic Time:</p>
                      <div className="text-3xl font-bold text-blue-400 mb-1">1 hour 47 minutes</div>
                      <p className="text-white/50 text-sm">Not a single student exceeds 3 hours</p>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      We understand it sounds impossible. How can less time lead to better results?<br /><br />
                      The answer lies in efficiency: personalized pacing means no waiting for others, 
                      no repeating what you already know, and no busy work. Every minute counts 
                      when it's tailored exactly to where each child needs to grow.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* NEW: Advanced Students Breaking Limits */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'advanced-breaking-limits' ? null : 'advanced-breaking-limits')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">When Students Can Learn at Their Own Pace</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'advanced-breaking-limits' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'advanced-breaking-limits' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'advanced-breaking-limits' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm mb-4">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-white/60 font-medium py-2 px-4">Student</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Age Grade</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Knowledge Grade</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Years Ahead</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5">
                            <td className="text-white/80 py-3 px-4">Mira</td>
                            <td className="text-center text-white/60 py-3 px-4">4th</td>
                            <td className="text-center text-blue-400 font-medium py-3 px-4">11th</td>
                            <td className="text-center text-green-400 font-bold py-3 px-4">+7</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-white/[0.02]">
                            <td className="text-white/80 py-3 px-4">Charlie</td>
                            <td className="text-center text-white/60 py-3 px-4">4th</td>
                            <td className="text-center text-blue-400 font-medium py-3 px-4">10th</td>
                            <td className="text-center text-green-400 font-bold py-3 px-4">+6</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="text-white/80 py-3 px-4">Aaron</td>
                            <td className="text-center text-white/60 py-3 px-4">6th</td>
                            <td className="text-center text-blue-400 font-medium py-3 px-4">12th</td>
                            <td className="text-center text-green-400 font-bold py-3 px-4">+6</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-white/50 text-sm">
                      These students were often under-challenged in traditional settings. With personalized pacing,
                      they're finally able to learn at their natural speed and reach their full potential.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Every Type of Student Thrives */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'every-student-thrives' ? null : 'every-student-thrives')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Every Type of Student Thrives</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'every-student-thrives' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'every-student-thrives' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'every-student-thrives' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">3.9x</div>
                        <p className="text-white/80 font-medium mb-1">Top 20% of Students</p>
                        <p className="text-white/60 text-sm">Learn 3.9x faster when not held back</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">2.6x</div>
                        <p className="text-white/80 font-medium mb-1">Middle 60% of Students</p>
                        <p className="text-white/60 text-sm">Learn 2.6x faster with personal help</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">2.2x</div>
                        <p className="text-white/80 font-medium mb-1">Bottom 20% of Students</p>
                        <p className="text-white/60 text-sm">Still learn 2.2x faster than peers</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm mt-4 text-center">
                      We believe every child has untapped potential. Our data shows consistent growth 
                      across all starting points - because personalized learning meets each child where they are.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Kids Catching Up */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'kids-catching-up' ? null : 'kids-catching-up')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Supporting Students Who Need to Catch Up</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'kids-catching-up' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'kids-catching-up' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'kids-catching-up' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="bg-white/[0.02] rounded-xl p-4 mb-4">
                      <h5 className="text-white/80 font-medium mb-2">The Data:</h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="text-white/60">7 boys, all 2+ years behind grade level</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="text-white/60">Completed 2 full grade levels in 6 months</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="text-white/60">Learning speed: 4.6x faster than traditional school</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-white/50 text-sm">
                      Every child learns differently. When we identify and address individual learning gaps,
                      students who were struggling can finally experience the joy of understanding and progress.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* NEW: Kindergarten Success */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'kindergarten-success' ? null : 'kindergarten-success')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">Even 5-Year-Olds Excel</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'kindergarten-success' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'kindergarten-success' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'kindergarten-success' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="text-center mb-4">
                      <p className="text-white/60 mb-2">By end of Kindergarten:</p>
                      <div className="text-5xl font-bold text-blue-400 mb-2">Top 1%</div>
                      <p className="text-white/60 text-sm">Nationally in both Math and Reading</p>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">
                      We were initially unsure if our youngest learners could thrive with this approach.
                      What we discovered was beautiful: when given the right tools and support, 
                      5-year-olds embrace learning with incredible enthusiasm and achieve remarkable milestones.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* NEW: High School Dominance */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'high-school-dominance' ? null : 'high-school-dominance')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">High School: Prepared for What's Next</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'high-school-dominance' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'high-school-dominance' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'high-school-dominance' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-white/[0.02] rounded-xl p-4">
                        <h5 className="text-white/80 font-medium mb-2">SAT Performance</h5>
                        <div className="text-3xl font-bold text-blue-400">1470+</div>
                        <p className="text-white/50 text-sm">National Average: 1028</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4">
                        <h5 className="text-white/80 font-medium mb-2">AP Test Results</h5>
                        <div className="text-3xl font-bold text-blue-400">90%</div>
                        <p className="text-white/50 text-sm">Score 4s or 5s (highest scores)</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/60">College Acceptances:</p>
                      <p className="text-white/50">Stanford, Vanderbilt, USC, NYU, UT Honors, Howard, Northeastern</p>
                      <p className="text-white/60 mt-2">50% National Merit Scholars or Commended</p>
                    </div>
                    <p className="text-white/40 text-xs mt-4">
                      These students have been learning through personalized AI and caring mentors since elementary school.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Low Income Students */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'low-income-students' ? null : 'low-income-students')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">The Great Equalizer: Low Income Students</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'low-income-students' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'low-income-students' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'low-income-students' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="bg-white/[0.02] rounded-xl p-4 mb-4">
                      <p className="text-white/60 text-sm mb-3">Brownsville, TX - One of America's poorest districts:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/50 text-xs mb-1">Math Progress</p>
                          <p className="text-white/80 font-medium">31st → 84th percentile</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs mb-1">Reading Progress</p>
                          <p className="text-white/80 font-medium">31st → 71st percentile</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">
                      Personalized learning doesn't discriminate. Every child receives the same high-quality, 
                      individualized attention they deserve, helping close opportunity gaps that shouldn't exist.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Achievement Scores by Grade */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'achievement-by-grade' ? null : 'achievement-by-grade')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">MAP Test Results: Every Grade, Every Subject</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'achievement-by-grade' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'achievement-by-grade' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'achievement-by-grade' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-white/60 font-medium py-2 px-4">Grade</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Language</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Math</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Reading</th>
                            <th className="text-center text-white/60 font-medium py-2 px-4">Science</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["K", "-", "99", "99", "-"],
                            ["1", "-", "99", "99", "-"],
                            ["2", "99", "99", "99", "99"],
                            ["3", "99", "96", "99", "99"],
                            ["4", "99", "94", "99", "99"],
                            ["5", "99", "99", "99", "99"],
                            ["6", "99", "99", "99", "99"],
                            ["7", "99", "99", "99", "99"],
                            ["8", "99", "97", "99", "99"],
                            ["9", "99", "99", "99", "99"],
                            ["10", "99", "99", "99", "99"],
                            ["11", "99", "98", "99", "99"],
                          ].map((row, index) => (
                            <tr
                              key={row[0]}
                              className={`border-b border-white/5 hover:bg-white/[0.04] transition-colors ${
                                index % 2 === 1 ? "bg-white/[0.02]" : ""
                              }`}
                            >
                              <td className="text-white/80 py-3 px-4 font-medium">{row[0]}</td>
                              <td className="text-center text-white/60 py-3 px-4">{row[1]}</td>
                              <td className="text-center text-white/60 py-3 px-4">{row[2]}</td>
                              <td className="text-center text-white/60 py-3 px-4">{row[3]}</td>
                              <td className="text-center text-white/60 py-3 px-4">{row[4]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-white/40 text-xs mt-4">
                      * MAP (Measures of Academic Progress) - The same test millions of American students take each year.
                      These are national percentiles. 99 = top 1% in the nation.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* NEW: The Efficiency Proof */}
              <motion.div
                {...getMobileAwareAnimationProps()}
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSpecialCasesOpenIndex(specialCasesOpenIndex === 'efficiency-proof' ? null : 'efficiency-proof')}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <h4 className="text-lg md:text-xl font-semibold text-white/90 text-left">The Math Behind 2x Learning</h4>
                  </div>
                  <motion.div
                    animate={{ rotate: specialCasesOpenIndex === 'efficiency-proof' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: specialCasesOpenIndex === 'efficiency-proof' ? "auto" : 0,
                    opacity: specialCasesOpenIndex === 'efficiency-proof' ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6">
                    <div className="space-y-4">
                      <div className="bg-white/[0.02] rounded-xl p-4">
                        <h5 className="text-white/80 font-medium mb-2">Traditional School:</h5>
                        <p className="text-white/60 text-sm">180 days × 1 hour/day = 180 hours per subject</p>
                        <p className="text-white/50 text-xs mt-1">Plus homework, tutoring, summer school...</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4">
                        <h5 className="text-white/80 font-medium mb-2">2 Hour Learning:</h5>
                        <p className="text-white/60 text-sm">3rd grade complete: 40 hours</p>
                        <p className="text-white/60 text-sm">4th grade complete: 35 hours</p>
                        <p className="text-blue-400 font-medium text-sm mt-2">2 grade levels: 75 hours total</p>
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-white/50 text-sm">Result: Same content, 58% less time, 100% mastery</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Still Skeptical? Read the Full Research */}
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mt-12 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 max-w-3xl mx-auto"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-4 text-center">
                Want to Learn More?
              </h3>
              <p className="text-white/70 text-base mb-6 text-center">
                We've documented everything in our comprehensive white paper - every methodology, 
                every data point, every student story.
                <br />
                <span className="text-white/50 text-sm">
                  27 pages of transparent data from 10 years of helping kids learn better.
                </span>
              </p>
              <div className="text-center">
                <a
                  href="https://heyzine.com/flip-book/2hourlearning.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <span>Read the 2 Hour Learning White Paper</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Join Waitlist Section */}
      <div className="relative py-16 md:py-24 overflow-hidden" id="join-waitlist">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-transparent to-gray-500/[0.005] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <BookShape
            delay={0.8}
            height={110}
            rotate={-8}
            bookColor="blue"
            className="left-[-4%] top-[25%]"
          />

          <BookShape
            delay={1.0}
            height={85}
            rotate={12}
            bookColor="green"
            className="right-[-2%] bottom-[35%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              {...getMobileAwareAnimationProps()}
              className="mb-8 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white/95 to-gray-300">
                  Ready to Give Kids Their Time Back?
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
                Whether you want this for your child, your school, or your entire community – 
                we have a path for you. Parents, educators, founders, governments, and supporters 
                are all building the future of education together.
              </p>
            </motion.div>

            <motion.div
              {...getMobileAwareAnimationProps()}
              className="max-w-md mx-auto"
            >
              <a
                href="https://form.typeform.com/to/hwv4xo9m"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-blue-500 text-white text-lg font-medium rounded-full hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-center"
              >
                Find Your Path to Better Learning →
              </a>
            </motion.div>
          </div>
        </div>
      </div>


    </div>
  )
}
