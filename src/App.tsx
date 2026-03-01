/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useSpring, useVelocity } from "motion/react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Phone,
  MapPin,
  Clock,
  Wifi,
  User,
  Car,
  Recycle,
  ShoppingBag,
  Instagram,
  Facebook,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  Menu,
  X,
  ArrowLeft,
  Twitter,
  Youtube
} from "lucide-react";

type Collection = { name: string; category: string; image: string };
type GalleryImage = { url: string; size: string; top: string; left: string; depth: number; direction: number; mobile: boolean };

const FEATURES = [
  { icon: User, title: "Women-Owned", desc: "Proudly independent and women-led boutique." },
  { icon: ShoppingBag, title: "Delivery & Pickup", desc: "Convenient home delivery and in-store pick-up." },
  { icon: Wifi, title: "Free Wi-Fi", desc: "Stay connected while you shop our collections." },
  { icon: Recycle, title: "Clothing Recycling", desc: "Join our sustainable fashion initiative." },
  { icon: Car, title: "Free Parking", desc: "Hassle-free parking for all our visitors." },
  { icon: CheckCircle2, title: "Quick Visit", desc: "Perfect for a fast, curated shopping experience." },
];

const TESTIMONIALS = [
  { text: "Royal Clothing has completely transformed my wardrobe. The quality of the fabrics and the elegance of the designs are unmatched in Sefrou.", author: "Sarah Alami" },
  { text: "The personalized service and the curated collection make every visit special. It's truly a gem in the heart of the city.", author: "Laila Mansouri" },
  { text: "I love the sustainable approach and the beautiful abayas. A perfect blend of tradition and modern style.", author: "Fatima Zahra" },
];


const imageReveal = {
  initial: { scale: 1.2, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
};

function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          style={{ originY: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[1000] bg-primary flex items-center justify-center overflow-hidden"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-4xl md:text-6xl font-serif tracking-tighter uppercase"
          >
            ROYAL CLOTHING
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FlashingLogo() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastColors, setLastColors] = useState<string[]>([]);

  useEffect(() => {
    return scrollVelocity.on("change", (latest) => {
      setIsScrolling(Math.abs(latest) > 50);
    });
  }, [scrollVelocity]);

  const words = ["ROYAL", "CLOTHING"];
  const allChars = words.join("").split("");

  useEffect(() => {
    if (lastColors.length === 0) {
      setLastColors(allChars.map(() => "#FFFFFF"));
    }
  }, []);

  return (
    <div className="flex flex-col gap-0 w-full">
      {words.map((word, wordIdx) => (
        <h2 key={wordIdx} className="text-[18vw] md:text-[11vw] lg:text-[15vw] font-serif leading-[0.75] tracking-tighter uppercase flex flex-wrap w-full justify-start">
          {word.split("").map((char, i) => {
            const charIdx = wordIdx === 0 ? i : words[0].length + i;
            return (
              <motion.span
                key={i}
                animate={isScrolling ? {
                  color: ["#FFFFFF", "#D3AE34", "#FFFFFF"],
                } : { color: lastColors[charIdx] || "#FFFFFF" }}
                onUpdate={(latest) => {
                  if (isScrolling && typeof latest.color === 'string') {
                    const newColors = [...lastColors];
                    newColors[charIdx] = latest.color;
                    setLastColors(newColors);
                  }
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  delay: Math.random() * 0.3,
                  ease: "linear",
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </h2>
      ))}
    </div>
  );
}

function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isOverTestimonials, setIsOverTestimonials] = useState(false);

  const springConfig = { damping: 20, stiffness: 400, mass: 0.3 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const testimonialSection = target.closest('#testimonials-section');
      setIsOverTestimonials(!!testimonialSection);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isOverTestimonials ? 0 : 1,
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:flex items-center justify-center cursor-blend"
    >
      <motion.div
        animate={{
          width: isHovering ? 60 : 12,
          height: isHovering ? 60 : 12,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "#FFFFFF",
          border: isHovering ? "1px solid #FFFFFF" : "none",
        }}
        className="rounded-full flex items-center justify-center backdrop-blur-[2px]"
      >
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <ArrowUpRight className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function GalleryItem({ img, idx, galleryScroll }: { img: GalleryImage; idx: number; galleryScroll: any }) {
  const rawY = useTransform(
    galleryScroll,
    [0, 1],
    [img.direction * 600 * img.depth, -img.direction * 600 * img.depth]
  );
  const y = useSpring(rawY, { damping: 15, stiffness: 40, mass: 1.2 });

  return (
    <motion.div
      style={{
        top: img.top,
        left: img.left,
        y,
        zIndex: Math.floor(img.depth * 100),
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute w-[200px] lg:w-[300px] h-auto rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${!img.mobile ? 'hidden md:block' : 'block'}`}
    >
      <img
        src={img.url}
        alt={`Gallery ${idx}`}
        className="w-full h-full object-cover transition-all duration-700"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}

export default function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialRef = useRef(null);
  const galleryRef = useRef(null);
  const collectionsRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);
  const [arrowDirection, setArrowDirection] = useState<'left' | 'right'>('right');
  const [activeCollection, setActiveCollection] = useState(0);

  // Dynamic data from Supabase
  const [collections, setCollections] = useState<Collection[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: collectionsData } = await supabase
        .from('collections')
        .select('name, category, image')
        .order('id');
      if (collectionsData && collectionsData.length > 0) {
        setCollections(collectionsData);
      }

      const { data: galleryData } = await supabase
        .from('gallery_images')
        .select('url, size, top, left, depth, direction, mobile')
        .order('id');
      if (galleryData && galleryData.length > 0) {
        setGalleryImages(galleryData);
      }
    }
    fetchData();
  }, []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: testimonialScroll } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: galleryScroll } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const isLg = window.matchMedia('(min-width: 1024px)').matches;
    if (!isLg) return; // On mobile, only arrow clicks change collections

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-collection-idx'));
            if (!isNaN(idx)) setActiveCollection(idx);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    const titles = document.querySelectorAll('[data-collection-idx]');
    titles.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [collections]);

  const heroTextY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroImageY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  const testimonialBgY = useTransform(testimonialScroll, [0, 1], ["-20%", "20%"]);
  const testimonialTextY = useTransform(testimonialScroll, [0, 1], [50, -50]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!testimonialRef.current) return;
    const rect = testimonialRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });

    const relativeX = x - rect.left;
    if (relativeX < rect.width / 2) {
      setArrowDirection('left');
    } else {
      setArrowDirection('right');
    }
  }, []);

  const nextTestimonial = () => {
    if (arrowDirection === 'right') {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    } else {
      setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
  };

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=R5HC+PH+Sefrou+Morocco";

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white bg-white">
      <Preloader />
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference text-white">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-serif font-bold tracking-tighter"
          >
            ROYAL CLOTHING
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-12 text-[10px] font-medium uppercase tracking-[0.3em]">
              <a href="#collections" className="hover:text-accent transition-colors">Collections</a>
              <a href="#about" className="hover:text-accent transition-colors">About</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-full transition-all md:hidden flex flex-col gap-1.5 items-end"
            >
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
            </button>

            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              href="tel:+212653929954"
              className="hidden md:block text-[10px] font-medium uppercase tracking-[0.3em] border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all"
            >
              Let's talk
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[45] bg-white flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 text-4xl md:text-6xl font-serif text-primary uppercase tracking-tighter">
              <a
                href="#collections"
                onClick={() => setIsMenuOpen(false)}
                className="hover:italic hover:text-accent transition-all"
              >
                Collections
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:italic hover:text-accent transition-all"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:italic hover:text-accent transition-all"
              >
                Company
              </a>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:italic hover:text-accent transition-all"
              >
                Contact
              </a>
              <a
                href="tel:+212653929954"
                className="mt-4 text-[12px] font-medium uppercase tracking-[0.3em] bg-primary text-white px-10 py-4 rounded-full hover:bg-accent transition-all"
              >
                Let's talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[110vh] flex items-center justify-start overflow-hidden bg-primary">
        <motion.div style={{ y: heroImageY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
            alt="Boutique"
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="relative z-10 w-full px-6 md:px-12">
          <motion.div style={{ y: heroTextY }} className="max-w-[1400px] mx-auto text-left py-20">
            <h1 className="text-[14vw] md:text-[12vw] text-white font-serif leading-[0.8] tracking-tighter uppercase">
              <div className="reveal-text overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  Your <span className="text-accent italic">Royal</span>
                </motion.div>
              </div>
              <div className="reveal-text overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  Essence
                </motion.div>
              </div>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex flex-wrap gap-8 items-center justify-start"
            >
              <a
                href="#collections"
                className="group flex items-center gap-4 text-white text-[10px] font-medium uppercase tracking-[0.3em]"
              >
                View our collections
                <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center group-hover:bg-transparent group-hover:text-white border border-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="py-12 bg-accent overflow-hidden border-y border-primary/10 marquee-container">
        <div className="marquee-content">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-primary font-serif text-4xl md:text-6xl uppercase tracking-tighter px-8">
              Royal Clothing • Boutique • Women-Owned • Sefrou • Morocco •
            </span>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-serif text-primary leading-tight mb-8"
              >
                Crafting <span className="italic text-accent">Elegance</span> Since Day One.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-primary/60 leading-relaxed max-w-md"
              >
                Royal Clothing isn't just a store; it's a sanctuary for women who appreciate the finer details of life. We curate pieces that speak to your soul.
              </motion.p>
            </div>

            <div className="relative h-[600px] w-full">
              {/* Floating Images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, 20, 0] }}
                transition={{
                  y: { duration: 5, ease: "easeInOut", delay: 1 },
                  opacity: { duration: 0.8, delay: 0.2 },
                  scale: { duration: 0.8, delay: 0.2 }
                }}
                className="absolute top-40 left-0 w-72 h-96 z-10 shadow-xl rounded-lg overflow-hidden"
              >
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" alt="About 2" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  y: { duration: 7, ease: "easeInOut", delay: 0.5 },
                  opacity: { duration: 0.8, delay: 0.4 },
                  scale: { duration: 0.8, delay: 0.4 }
                }}
                className="absolute bottom-0 right-20 w-56 h-72 z-20 shadow-lg rounded-lg overflow-hidden"
              >
                <img src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=600" alt="About 3" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section - Sticky Preview Style */}
      <section id="collections" ref={collectionsRef} className="py-40 bg-white lg:h-[260vh]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sticky Image Side - hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 lg:sticky lg:top-24 lg:self-start lg:h-[70vh] order-2 lg:order-1">
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-primary/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeCollection}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={collections[activeCollection]?.image}
                    alt={collections[activeCollection]?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute bottom-8 left-8 z-10">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 mb-2 block">
                    {collections[activeCollection]?.category} • 2026
                  </span>
                  <h3 className="text-4xl font-serif text-white tracking-tight">
                    {collections[activeCollection]?.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Scrolling Text Side */}
            <div className="lg:w-1/2 flex flex-col gap-32 order-1 lg:order-2">
              <div className="mb-12">
                <h2 className="text-5xl md:text-7xl font-serif text-primary leading-tight mb-8">
                  Our <span className="italic text-accent">Collections</span>
                </h2>
                <p className="text-xl text-primary/60 max-w-md">
                  Explore our curated selections, where each piece tells a story of elegance and heritage.
                </p>
                <p className="text-xs text-primary/30 mt-4 lg:hidden">
                  Tap the arrow to preview each collection
                </p>
              </div>

              <div className="flex flex-col">
                {collections.map((item, idx) => (
                  <motion.div
                    key={idx}
                    data-collection-idx={idx}
                    onMouseEnter={() => setActiveCollection(idx)}
                    className={`py-12 border-b border-primary/10 group transition-all duration-500 ${activeCollection === idx ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-8">
                        <span className="text-sm font-mono text-accent">0{idx + 1}</span>
                        <h3 className="text-4xl md:text-6xl font-serif text-primary group-hover:italic transition-all">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCollection(activeCollection === idx ? -1 : idx);
                        }}
                        className="lg:pointer-events-none"
                      >
                        <ArrowUpRight className={`w-8 h-8 transition-transform duration-500 ${activeCollection === idx ? 'rotate-0' : '-rotate-45'}`} />
                      </button>
                    </div>

                    {/* Mobile accordion image */}
                    <AnimatePresence>
                      {activeCollection === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden lg:hidden"
                        >
                          <div className="relative mt-6 rounded-xl overflow-hidden aspect-[4/5]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <span className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                              {item.category} • 2026
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              {/* Spacer so the last collection stays visible before section ends */}
              <div className="hidden lg:block h-[5vh]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Minimalist Cards */}
      <section id="about" className="py-40 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-24 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              We apply <span className="italic text-accent">storytelling</span> to fashion.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-primary p-12 hover:bg-white/5 transition-colors group"
              >
                <feature.icon className="w-8 h-8 text-accent mb-8 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-serif mb-4">{feature.title}</h4>
                <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - RYTHM Style Slider with Custom Cursor */}
      <section
        id="testimonials-section"
        ref={testimonialRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveringTestimonials(true)}
        onMouseLeave={() => setIsHoveringTestimonials(false)}
        onClick={nextTestimonial}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <motion.div
          style={{ y: testimonialBgY }}
          className="absolute inset-0 z-0 h-[140%] -top-[20%]"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&get=80&w=2000"
            alt="Fashion Background"
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Testimonial specific custom cursor */}
        <AnimatePresence>
          {isHoveringTestimonials && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: mousePos.x - 40, y: mousePos.y - 40 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 150, mass: 0.8 }}
              className="fixed top-0 left-0 z-[100] w-20 h-20 rounded-full border border-white/50 hidden md:flex items-center justify-center pointer-events-none bg-transparent"
            >
              {arrowDirection === 'left' ? <ArrowLeft className="text-white w-6 h-6" /> : <ArrowRight className="text-white w-6 h-6" />}
            </motion.div>
          )}
        </AnimatePresence>



        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: arrowDirection === 'right' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: arrowDirection === 'right' ? -50 : 50 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.2] tracking-tight mb-12"
                style={{ y: testimonialTextY }}
              >
                "{TESTIMONIALS[currentTestimonial].text}"
              </motion.p>
              <div>
                <h4 className="text-white font-serif text-xl">{TESTIMONIALS[currentTestimonial].author}</h4>
                <p className="text-accent text-[10px] uppercase tracking-[0.2em] mt-1">Verified Customer</p>
                {/* Mobile Navigation Arrows - centered under author */}
                <div className="flex items-center justify-center gap-6 mt-6 md:hidden">
                  <button onClick={(e) => { e.stopPropagation(); setArrowDirection('left'); nextTestimonial(); }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setArrowDirection('right'); nextTestimonial(); }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery Section - Floating Images with Scroll-Driven Parallax */}
      <section ref={galleryRef} className="relative h-screen lg:h-[160vh] bg-primary overflow-hidden">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <h2 className="text-white/5 text-[25vw] font-serif uppercase tracking-tighter select-none pointer-events-none">
            Gallery
          </h2>

          {galleryImages.map((img, idx) => (
            <GalleryItem key={idx} img={img} idx={idx} galleryScroll={galleryScroll} />
          ))}
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-end">
            <div>
              <h2 className="text-6xl md:text-8xl font-serif text-primary leading-[0.9] tracking-tighter uppercase mb-12">
                Let's start <br />
                <span className="text-accent">building</span> <br />
                experiences.
              </h2>
              <div className="space-y-12">
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent mb-4">Email us</h4>
                  <a href="mailto:info@royalclothing.ma" className="text-3xl font-serif text-primary hover:italic transition-all">
                    info@royalclothing.ma
                  </a>
                </div>
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent mb-4">Call us</h4>
                  <a href="tel:+212653929954" className="text-3xl font-serif text-primary hover:italic transition-all">
                    +212 653 92 99 54
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-12 w-full">
              <div className="aspect-video bg-primary/5 rounded-2xl overflow-hidden relative group w-full md:mx-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.6691669010797!2d-4.8333569017951765!3d33.829347199999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f9b830bb24e9f%3A0x803cfd5dc1f4320f!2sROYAL%20CLOTHING!5e1!3m2!1sen!2sma!4v1772206536350!5m2!1sen!2sma"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent mb-4">Hours</h4>
                  <p className="text-primary/60 leading-relaxed">
                    10:00 AM – 11:00 PM<br />
                    Open Daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-24 border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <FlashingLogo />
            <div className="flex gap-8 text-white/60 w-full md:w-auto justify-center md:justify-end">
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Youtube className="w-6 h-6" /></a>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 uppercase tracking-[0.3em]">
            <p>&copy; {new Date().getFullYear()} Royal Clothing Boutique.</p>
            <p>Sefrou, Morocco</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
