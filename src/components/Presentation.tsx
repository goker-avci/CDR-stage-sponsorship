import React, { useState, useEffect, useRef } from 'react';
import {
  motion, useScroll, useTransform, AnimatePresence, useInView,
  useMotionValue, useSpring,
} from 'framer-motion';
import {
  ChevronDown, ArrowRight, ExternalLink, Calendar, Users, MapPin,
  Target, Fingerprint, Award, LineChart, MessageSquare, Briefcase, Zap, Radio,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Hooks ───────────────────────────────────────────────────────────────────
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) setActive(id); }),
        { threshold: 0.35 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, [ids]);
  return active;
};

const useMagnet = () => {
  const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 720);
  const y = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 450);
  const sx = useSpring(x, { stiffness: 50, damping: 20 });
  const sy = useSpring(y, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  return { sx, sy };
};

// ─── CharReveal ───────────────────────────────────────────────────────────────
const CharReveal = ({ text, className = '', delay = 0, stagger = 0.03 }: {
  text: string; className?: string; delay?: number; stagger?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split('').map((c, i) => (
        <motion.span key={i} className="inline-block"
          style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 40, rotateX: -30 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: delay + i * stagger }}
        >{c}</motion.span>
      ))}
    </span>
  );
};

// ─── DrawLine ─────────────────────────────────────────────────────────────────
const DrawLine = ({ className = '', delay = 0 }: { className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} className={className}
      initial={{ scaleX: 0 }} style={{ originX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
};

// ─── SECTION 1 — COVER ───────────────────────────────────────────────────────
const Section1Cover = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { sx, sy } = useMagnet();

  return (
    <section ref={containerRef} id="cover" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">

      {/* Full-bleed Istanbul image, parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <img
          src="/images/istanbul.png"
          alt="Istanbul"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
      </motion.div>

      {/* Mouse-tracking light blob */}
      <motion.div className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle 400px at ${sx}px ${sy}px, rgba(255,255,255,0.06), transparent 70%)`
        }}
      />

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="absolute border border-white/[0.06] rounded-full"
            animate={{ width: [200, 800], height: [200, 800], opacity: [0.7, 0] }}
            transition={{ duration: 4.5, delay: i * 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ y: contentY, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6">
        <motion.div className="mb-10"
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <img src="/images/CDRStage-logo.png" alt="CDR Stage"
            className="h-28 md:h-36 object-contain invert opacity-90"
          />
        </motion.div>

        <div className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none mb-3 perspective-[800px]">
          <CharReveal text="CDR Stage" delay={0.4} stagger={0.05} className="block" />
        </div>
        <div className="font-serif text-4xl md:text-6xl lg:text-7xl italic font-normal text-white/55 mb-12">
          <CharReveal text="Towards COP31" delay={0.85} stagger={0.04} className="block" />
        </div>

        <DrawLine delay={1.4} className="h-px bg-white/20 mb-8 w-64" />

        <motion.p className="text-lg md:text-xl text-white/45 tracking-[0.3em] uppercase mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 1.6 }}
        >Sponsorship Deck</motion.p>

        <motion.div className="flex items-center gap-3 text-xs text-white/35 uppercase tracking-widest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.9 }}
        >
          <span>In-Person Gathering</span>
          <span className="w-1 h-1 bg-white/35 rounded-full" />
          <span>26 June 2026</span>
          <span className="w-1 h-1 bg-white/35 rounded-full" />
          <span>Istanbul</span>
        </motion.div>

        <motion.p className="mt-10 text-[10px] text-white/20 uppercase tracking-[0.25em]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >Presented by Alalëa Decarbonization and Carbon Markets Advisory</motion.p>
      </motion.div>

      <motion.div className="absolute bottom-10 z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── SECTION 2 — PURPOSE ─────────────────────────────────────────────────────
const Section2Purpose = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const points = [
    'Credibility for a fast-growing but often misunderstood field',
    'Connections across policy, finance, industry, and civil society',
    'Visibility for carbon removal in the regional climate agenda',
  ];

  return (
    <section ref={ref} id="purpose" className="relative min-h-screen bg-white text-black overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left — image */}
        <motion.div className="relative h-64 lg:h-auto overflow-hidden"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          <motion.img
            src="/images/global-network.png"
            alt="Global CDR Network"
            className="w-full h-full object-cover grayscale"
            initial={{ scale: 1.08 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          <div className="absolute bottom-8 left-8">
            <motion.span
              className="text-[120px] font-serif font-bold text-white/10 leading-none select-none"
              initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >02</motion.span>
          </div>
        </motion.div>

        {/* Right — content */}
        <div className="flex items-center px-10 lg:px-16 py-20">
          <div className="max-w-lg">
            <motion.span className="text-xs font-bold uppercase tracking-widest text-black/35 block mb-6"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            >Platform Purpose</motion.span>

            <motion.h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            >
              A Platform for the Carbon Removal Conversation
              <span className="italic font-normal text-black/35"> Before COP31</span>
            </motion.h2>

            <motion.p className="text-base text-black/55 leading-relaxed font-light mb-10"
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            >
              A high-trust convening platform connecting the actors who will shape how CDR is understood, discussed, and positioned ahead of COP31 in Türkiye.
            </motion.p>

            <div className="space-y-4">
              {points.map((p, i) => (
                <motion.div key={i}
                  className="flex items-start gap-4 p-5 border border-black/8 hover:border-black/25 hover:bg-black/[0.02] transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.45 + i * 0.13 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="font-serif text-2xl text-black/20 font-bold leading-none shrink-0 mt-0.5">0{i + 1}</span>
                  <p className="text-base font-medium leading-snug">{p}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 3 — CDR IN PRACTICE ─────────────────────────────────────────────
const Section3Practice = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="practice" className="relative min-h-screen bg-[#f2f2f2] text-black overflow-hidden">

      {/* Header */}
      <div className="px-10 lg:px-16 pt-20 pb-12 max-w-6xl mx-auto">
        <motion.span className="text-xs font-bold uppercase tracking-widest text-black/35 block mb-5"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >03 · What CDR Means</motion.span>
        <motion.h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          What CDR Means <span className="italic font-normal text-black/40">in Practice</span>
        </motion.h2>

        {/* Flow */}
        <motion.div className="flex items-center gap-4 mt-10 mb-0"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          {['Atmosphere', 'Removal', 'Storage'].map((item, i) => (
            <React.Fragment key={i}>
              <motion.div
                className="px-6 py-3 border border-black/20 bg-white font-serif font-bold text-sm tracking-wider"
                whileHover={{ scale: 1.06, borderColor: 'rgba(0,0,0,0.6)' }}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15 }}
              >{item}</motion.div>
              {i < 2 && (
                <motion.div className="flex-1 h-px bg-black/25 origin-left"
                  initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.55 + i * 0.15 }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Two image panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* Nature-based */}
        <motion.div className="relative h-80 md:h-[480px] overflow-hidden group"
          initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
        >
          <motion.img
            src="/images/nature-cdr.png"
            alt="Nature-based CDR"
            className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Nature-based CDR</p>
            <h3 className="font-serif text-2xl text-white font-bold mb-3">Forests, Soils, Wetlands</h3>
            <p className="text-sm text-white/65 leading-relaxed font-light mb-5">
              Natural systems that absorb and store carbon. Important role, but permanence and measurement can vary.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Afforestation', 'Soil Carbon', 'Blue Carbon'].map((t, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 border border-white/25 text-white/70 uppercase tracking-wider font-medium">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Engineered */}
        <motion.div className="relative h-80 md:h-[480px] overflow-hidden group"
          initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.55 }}
        >
          <motion.img
            src="/images/engineered-cdr.png"
            alt="Engineered CDR"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          {/* Engineered badge */}
          <div className="absolute top-6 right-6">
            <motion.span
              className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-3 py-1.5"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >Priority Focus</motion.span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Engineered CDR</p>
            <h3 className="font-serif text-2xl text-white font-bold mb-3">Technology-Driven Removal</h3>
            <p className="text-sm text-white/75 leading-relaxed font-medium mb-5">
              Stronger durability, clearer carbon accounting, and greater long-term strategic relevance for net-zero pathways.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Biochar', 'BECCS', 'DACCS', 'Enhanced Weathering'].map((t, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 bg-white text-black uppercase tracking-wider font-bold">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── SECTION 4 — GLOBAL MOMENTUM ─────────────────────────────────────────────
const Section4Momentum = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);

  const cards = [
    { title: 'EU Carbon Removal Carbon Farming', detail: 'The EU adopted the world\'s first legal framework for certifying carbon removals (Regulation 2024/3012), establishing quality criteria for permanent industrial removals and carbon storage, a landmark step.', icon: Award },
    { title: 'CDR Into Carbon Markets', detail: 'Policymakers are actively exploring how engineered removals can be integrated into ETS-style systems, signalling demand-side pull for CDR credits at significant scale.', icon: LineChart },
    { title: 'Frontier: $1B+ Advance Market Commitment', detail: 'Backed by Stripe, Alphabet, Shopify, Meta, and McKinsey: over $1 billion committed to purchasing carbon removal credits by 2030. The largest demand-side signal of its kind.', icon: Target },
    { title: 'Growing Private Investment', detail: 'VC and corporate investment into DACCS, BECCS, enhanced weathering, and biochar has surged, with hundreds of millions deployed as the engineered CDR market matures.', icon: Zap },
    { title: 'COP31 in Türkiye: The Opportunity', detail: 'COP31 in 2026 creates a significant opportunity to elevate CDR\'s visibility, especially with the dedicated carbon removal pavillion that is going to take place at COP31 Antalya.', icon: MapPin, featured: true },
  ];

  return (
    <section ref={ref} id="momentum" className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left — COP conference image */}
        <motion.div className="relative h-64 lg:h-auto order-2 lg:order-1 overflow-hidden"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <motion.img
            src="/images/cop-conference.png"
            alt="Climate Conference"
            className="w-full h-full object-cover opacity-40"
            initial={{ scale: 1.1 }} animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Stat overlays */}
          <div className="absolute bottom-10 left-8 right-8 space-y-4">
            {[
              { num: '5+', label: 'Policy frameworks advancing CDR' },
              { num: '$1B+', label: 'Committed to CDR purchases' },
              { num: 'COP31', label: 'Antalya 2026' },
            ].map((stat, i) => (
              <motion.div key={i}
                className="flex items-baseline gap-4"
                initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.15 }}
              >
                <span className="font-serif text-3xl font-bold text-white">{stat.num}</span>
                <span className="text-xs text-white/45 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — content */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20 order-1 lg:order-2 relative">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }}
          />
          <motion.span className="text-xs font-bold uppercase tracking-widest text-white/35 block mb-6"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          >04 · Global Momentum</motion.span>

          <motion.h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8"
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            CDR Is Moving to the Center of the
            <span className="italic font-normal text-white/50"> Climate Conversation</span>
          </motion.h2>

          <DrawLine delay={0.4} className="h-px bg-white/12 mb-8 w-full" />

          <div className="space-y-3">
            <TooltipProvider delayDuration={80}>
              {cards.map((card, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.35 + i * 0.1 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200
                          ${card.featured ? 'border-white/40 bg-white/5' : 'border-white/10 bg-transparent hover:border-white/30 hover:bg-white/4'}
                        `}
                        whileHover={{ x: 4 }}
                        onHoverStart={() => setHovered(i)}
                        onHoverEnd={() => setHovered(null)}
                      >
                        <card.icon className={`w-5 h-5 shrink-0 ${card.featured ? 'text-white' : 'text-white/35'}`} />
                        <span className={`text-sm font-medium ${card.featured ? 'text-white' : 'text-white/70'}`}>{card.title}</span>
                        <ArrowRight className="w-3 h-3 text-white/20 ml-auto shrink-0" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs p-4 bg-white text-black border-none rounded-none shadow-2xl">
                      <p className="text-sm leading-relaxed font-medium">{card.detail}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </TooltipProvider>
          </div>
          <p className="text-[10px] text-white/25 uppercase tracking-wider mt-4">Hover each item for detail</p>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 5 — TEAM ────────────────────────────────────────────────────────
const Section5Team = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const organizers = [
    {
      name: 'Göker Avcı',
      title: 'Decarbonization Strategist & Carbon Markets Expert',
      bio: 'Advises corporates on science-based decarbonization roadmaps, high-integrity carbon credit use, and engineered CDR integration. Co-authored the world\'s first methodology-agnostic forward-crediting standard for engineered CDR. Chartered Environmentalist (CEnv), MSc Sustainable Development.',
      img: '/images/GokerAvci.png',
      linkedin: 'https://www.linkedin.com/in/goker-avci/',
    },
    {
      name: 'Pınar Öncel',
      title: 'Sustainability Consultant & Co-founder, ClaimCarbon',
      bio: 'Co-founder of ClaimCarbon, accelerating CDR through partnerships, project development, and pre-finance solutions. Over 15 years driving systemic change. Co-founded the Sustainable Living Film Festival (2008–2022).',
      img: '/images/PinarOncel.png',
      linkedin: 'https://www.linkedin.com/in/pinaroncel/',
    },
  ];

  return (
    <section ref={ref} id="team" className="relative bg-[#0e0e0e] text-white overflow-hidden">

      {/* Top header band */}
      <div className="px-10 lg:px-16 pt-20 pb-12">
        <motion.span className="text-xs font-bold uppercase tracking-widest text-white/30 block mb-5"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >05 · The Team</motion.span>
        <motion.h2 className="font-serif text-5xl md:text-7xl font-bold leading-none"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >The Team Behind <span className="italic font-normal text-white/35">CDR Stage</span></motion.h2>
      </div>

      {/* Organizer cards — full portrait, side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {organizers.map((p, i) => (
          <motion.div key={i}
            className={`group relative overflow-hidden ${i === 0 ? 'md:border-r border-white/[0.06]' : ''}`}
            initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.18 }}
          >
            {/* Portrait — tall, no grayscale, no fading overlay */}
            <div className="relative h-[520px] md:h-[600px] overflow-hidden">
              <motion.img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover object-top transition-transform duration-700"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8 }}
              />
              {/* Only a subtle bottom shadow so text is readable */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0e0e0e] to-transparent" />

              {/* Name + title pinned to bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
                <h3 className="font-serif text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">{p.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-white/55">{p.title}</p>
              </div>
            </div>

            {/* Bio + LinkedIn below */}
            <div className="px-8 py-8 border-t border-white/[0.06]">
              <p className="text-sm text-white/55 leading-relaxed font-light mb-6">{p.bio}</p>
              <motion.a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-white/50 transition-colors"
                whileHover={{ x: 4 }} transition={{ duration: 0.2 }}
              >
                LinkedIn Profile <ExternalLink className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alalea block */}
      <motion.div className="px-10 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center gap-8 border-t border-white/[0.06]"
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
      >
        <div className="flex-1">
          <p className="text-sm text-white/65 font-light leading-relaxed">
            <strong className="text-white font-serif text-lg font-bold">Alalea Decarbonization and Carbon Markets Advisory</strong> is a specialist climate advisory firm helping companies build credible decarbonization strategies, navigate carbon markets with rigor, and engage with high-integrity Carbon Dioxide Removal (CDR) as an emerging pillar of long-term climate action.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest shrink-0">
          <motion.a href="https://alalea.com.tr/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:opacity-60 transition-opacity"
            whileHover={{ x: 3 }}
          >www.alalea.com.tr <ExternalLink className="w-3.5 h-3.5" /></motion.a>
          <span className="text-white/40 normal-case font-normal tracking-normal text-xs">
            In collaboration with <a href="https://surdurulebilirlikadimlari.org/" target="_blank" rel="noopener noreferrer" className="underline text-white/50">SADE</a>
          </span>
        </div>
      </motion.div>
    </section>
  );
};

// ─── SECTION 6 — SERIES ──────────────────────────────────────────────────────
const Section6Series = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<number | null>(null);

  const nodes = [
    { date: '22 Apr', title: 'The Net Zero Reality Check: Carbon Removal is the Missing Piece', past: true },
    { date: '21 May', title: 'Investing in Removal: Financing Models and CDR Credit Markets', past: true },
    { date: '26 Jun', title: 'How to Position the CDR Agenda in COP31', flagship: true },
    { date: '8 Jul', title: 'Scaling CDR Through Policy: Lessons for Türkiye and the Wider Region' },
    { date: '12 Aug', title: 'Beyond Abatement: CDR in Industrial Decarbonization Strategies' },
    { date: '9 Sep', title: 'Unlocking Türkiye\'s CDR Potential: From Strategy to Regional Hub' },
    { date: '14 Oct', title: 'CDR Ready for Action: A Stakeholder Roadmap for COP31' },
  ];

  return (
    <section ref={ref} id="series" className="relative min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left — stage image */}
        <motion.div className="relative h-64 lg:h-auto overflow-hidden"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <motion.img
            src="/images/event-stage.png"
            alt="Event Stage"
            className="w-full h-full object-cover opacity-50"
            initial={{ scale: 1.1 }} animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10">
            <motion.span className="text-[100px] font-serif font-bold text-white/[0.06] leading-none select-none"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            >06</motion.span>
          </div>
        </motion.div>

        {/* Right — timeline */}
        <div className="flex flex-col justify-center px-10 lg:px-14 py-20">
          <motion.span className="text-xs font-bold uppercase tracking-widest text-white/35 block mb-6"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          >2026 Series</motion.span>
          <motion.h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4"
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >The CDR Stage <span className="italic font-normal text-white/40">Series</span></motion.h2>
          <motion.p className="text-sm text-white/45 leading-relaxed mb-10 font-light"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.35 }}
          >Seven curated sessions, one flagship in-person gathering.</motion.p>

          <DrawLine delay={0.45} className="h-px bg-white/10 mb-8 w-full" />

          <TooltipProvider delayDuration={80}>
            <div className="space-y-0">
              {nodes.map((node, i) => (
                <motion.div key={i}
                  className={`flex items-center gap-5 py-3.5 border-b border-white/[0.06] cursor-pointer group
                    ${node.flagship ? 'py-5' : ''}
                  `}
                  initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.4 + i * 0.08 }}
                  onHoverStart={() => setActive(i)}
                  onHoverEnd={() => setActive(null)}
                  whileHover={{ x: 4 }}
                >
                  {/* Node dot */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div className={`shrink-0 rounded-full flex items-center justify-center
                        ${node.flagship
                          ? 'w-8 h-8 bg-white'
                          : node.past ? 'w-5 h-5 border border-white/20' : 'w-5 h-5 border border-white/30 group-hover:border-white/70'}
                      `}
                        animate={node.flagship ? { boxShadow: ['0 0 0 rgba(255,255,255,0)', '0 0 14px rgba(255,255,255,0.5)', '0 0 0 rgba(255,255,255,0)'] } : {}}
                        transition={node.flagship ? { duration: 2.5, repeat: Infinity } : {}}
                      >
                        {node.flagship && <div className="w-3 h-3 bg-black rounded-full" />}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className={`p-3 max-w-[200px] border-none rounded-none ${node.flagship ? 'bg-white text-black' : 'bg-[#222] text-white'}`}>
                      <p className="text-xs font-serif font-bold">{node.title}</p>
                      {node.flagship && <p className="text-[10px] mt-1 font-bold uppercase tracking-wider">Flagship · Istanbul</p>}
                    </TooltipContent>
                  </Tooltip>

                  {/* Label */}
                  <div className="flex-1 flex items-baseline gap-3">
                    <span className={`text-xs font-bold uppercase tracking-widest shrink-0 ${node.flagship ? 'text-white' : 'text-white/35'}`}>{node.date}</span>
                    <span className={`text-sm leading-snug ${node.flagship ? 'text-white font-semibold' : 'text-white/60 font-light'}`}>{node.title}</span>
                  </div>

                  {node.flagship && (
                    <motion.span
                      className="shrink-0 text-[9px] font-bold uppercase tracking-widest bg-white/10 border border-white/30 px-2 py-1"
                      animate={{ borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.2)'] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >Flagship</motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 7 — FLAGSHIP EVENT ──────────────────────────────────────────────
const Section7Flagship = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const schedule = [
    { time: '13:00–13:30', title: 'Welcoming Coffee', desc: 'A curated arrival moment designed to set the tone for the afternoon and encourage early networking among participants.' },
    { time: '13:30–14:30', title: 'Panel Discussion', desc: 'A high-level discussion exploring how CDR can be more clearly positioned within COP31, and why the topic deserves greater visibility in the regional and international climate conversation.' },
    { time: '14:30–15:30', title: 'Fireside Conversations', desc: 'Smaller table-based conversations, accompanied by refreshments, designed to enable deeper exchange around selected themes in a more intimate format.' },
    { time: '15:30–17:00', title: 'Private Sponsor Sessions', desc: 'A dedicated space for direct interaction, relationship-building, and more targeted exchanges with speakers, sponsors and their guests.' },
  ];

  return (
    <section ref={ref} id="flagship" className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Full-bleed Istanbul hero image */}
      <div className="relative h-[45vh] overflow-hidden">
        <motion.img
          src="/images/istanbul.png"
          alt="Istanbul"
          className="w-full h-full object-cover opacity-50"
          initial={{ scale: 1.08 }} animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 2, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]" />

        {/* Overlaid title */}
        <div className="absolute inset-0 flex flex-col justify-end px-10 lg:px-16 pb-12">
          <motion.span className="inline-block px-3 py-1 border border-white/30 text-[10px] font-bold uppercase tracking-widest text-white/70 mb-5 w-fit"
            initial={{ opacity: 0, scaleX: 0, originX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          >26 June 2026</motion.span>
          <motion.h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          >
            The Flagship<br />
            <span className="italic font-normal text-white/50">In-Person Gathering</span>
          </motion.h2>
        </div>
      </div>

      {/* Lower content */}
      <div className="px-10 lg:px-16 py-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left — labels + description */}
        <div>
          <motion.p className="text-base text-white/55 font-light leading-relaxed mb-10"
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          >
            On 26 June 2026, CDR Stage will host its principal in-person gathering: <strong className="text-white font-medium">"How to Position the CDR Agenda in COP31."</strong> Bringing together stakeholders across policy, finance, corporate strategy, and innovation.
          </motion.p>

          <motion.div className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { icon: Calendar, label: '26 June 2026' },
              { icon: MapPin, label: 'Salt Galata, Istanbul' },
              { icon: Users, label: 'In Person' },
              { icon: MessageSquare, label: 'English' },
              { icon: Fingerprint, label: 'Curated Audience' },
              { icon: Radio, label: 'Intl. Speakers' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div key={i}
                className="flex items-center gap-2.5 p-3 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/50"
                initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.06 }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right — clickable schedule */}
        <div>
          <motion.p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          >Programme</motion.p>

          <div className="space-y-0">
            {schedule.map((item, i) => (
              <motion.div key={i}
                className="border-b border-white/[0.07] cursor-pointer"
                initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.12 }}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <div className="flex items-center gap-4 py-4 group">
                  <span className="text-xs text-white/30 uppercase tracking-wider w-24 shrink-0 font-bold">{item.time}</span>
                  <span className="font-serif text-lg font-bold flex-1">{item.title}</span>
                  <motion.span className="text-white/25 text-xs"
                    animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.3 }}
                  >▼</motion.span>
                </div>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.p className="text-sm text-white/50 leading-relaxed font-light pb-5 pl-28"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
                    >{item.desc}</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 mt-4 uppercase tracking-wider">Click to expand</p>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 8 — PARTNERSHIP ─────────────────────────────────────────────────
const Section8Partnership = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    { num: '01', title: 'Private Briefing Access', desc: 'Private briefing sessions with CDR Stage speakers after the main event.', icon: MessageSquare },
    { num: '02', title: 'Client Hospitality', desc: 'Invite up to five key partners to private VIP sessions within the gathering.', icon: Users },
    { num: '03', title: 'Strategic Introductions', desc: 'Introductions to attending companies and key participants in the CDR conversation.', icon: Briefcase },
    { num: '04', title: 'Logo & Communications', desc: 'Logo placement across event announcements and partner communications.', icon: Radio },
    { num: '05', title: 'Driving Force Positioning', desc: 'Positioned as a driving force behind the gathering ahead of COP31.', icon: Target },
  ];

  return (
    <section ref={ref} id="partnership" className="relative bg-white text-black overflow-hidden">

      {/* ── Header band ── */}
      <div className="relative bg-black text-white px-10 lg:px-16 pt-20 pb-16 overflow-hidden">
        {/* Large ghost number */}
        <span className="absolute right-8 top-1/2 -translate-y-1/2 font-serif font-bold text-[200px] leading-none text-white/[0.04] select-none pointer-events-none">08</span>

        <motion.span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/40 block mb-8"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >Sponsorship Packages</motion.span>

        <div className="max-w-5xl">
          <div className="overflow-hidden mb-2">
            <motion.h2
              className="font-serif text-7xl md:text-8xl lg:text-[100px] font-bold leading-none"
              initial={{ y: 110 }} animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
            >
              What Your
            </motion.h2>
          </div>
          <div className="overflow-hidden pb-4 mb-2">
            <motion.h2
              className="font-serif text-7xl md:text-8xl lg:text-[100px] font-bold leading-none italic text-white/70"
              initial={{ y: 110 }} animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.22 }}
            >
              Sponsorship
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="font-serif text-7xl md:text-8xl lg:text-[100px] font-bold leading-none"
              initial={{ y: 110 }} animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.29 }}
            >
              Includes
            </motion.h2>
          </div>
        </div>

        <motion.div className="mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-16"
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
        >
          <p className="text-base text-white/55 font-light leading-relaxed max-w-xl">
            The six benefits below summarise what is available across our packages. Each is tailored to the sponsor's goals — combining the elements most relevant to them.
          </p>
          <div className="shrink-0 flex items-center gap-6">
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-white">6</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Benefits</p>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-white">1</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Day</p>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-white">COP31</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Impact</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Benefit grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-black">
        {benefits.map((b, i) => (
          <motion.div key={i}
            className={`group relative overflow-hidden cursor-default border-b border-r border-black
              ${i % 3 === 2 ? 'lg:border-r-0' : ''}
              ${i % 2 === 1 ? 'sm:border-r-0 lg:border-r border-black' : ''}
              ${i % 3 === 2 ? '' : ''}
            `}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.07 }}
          >
            {/* Black hover fill */}
            <div className="absolute inset-0 bg-black origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />

            <div className="relative z-10 p-8 lg:p-10 flex flex-col min-h-[220px]">
              {/* Top row: number + icon */}
              <div className="flex items-start justify-between mb-8">
                <span className="font-serif text-5xl font-bold text-black/10 group-hover:text-white/15 leading-none transition-colors duration-300">{b.num}</span>
                <b.icon className="w-7 h-7 text-black/40 group-hover:text-white/60 transition-colors duration-300 mt-1" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl font-bold leading-tight mb-3 text-black group-hover:text-white transition-colors duration-300">{b.title}</h3>

              {/* Desc */}
              <p className="text-sm text-black/50 font-light leading-relaxed group-hover:text-white/65 transition-colors duration-300 mt-auto">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CTA strip ── */}
      <motion.div
        className="bg-black text-white px-10 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div>
          <p className="font-serif text-3xl md:text-4xl font-bold mb-2">Ready to be part of it?</p>
          <p className="text-sm text-white/50 font-light">Packages are shaped around your goals. Reach out directly.</p>
        </div>
        <motion.a
          href="mailto:goker@alalea.com.tr"
          className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest shrink-0 hover:bg-white/90 transition-colors"
          whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}
        >
          Get in Touch <ArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
};

// ─── SECTION 9 — CONTACT ─────────────────────────────────────────────────────
const Section9Contact = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="contact" className="relative min-h-screen bg-[#080808] text-white overflow-hidden flex flex-col">

      {/* Background Istanbul image, very dark */}
      <div className="absolute inset-0">
        <img src="/images/istanbul.png" alt="" className="w-full h-full object-cover opacity-8 grayscale" />
        <div className="absolute inset-0 bg-[#080808]/92" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-10 lg:px-20 py-24 max-w-5xl mx-auto w-full">
        <div className="overflow-hidden mb-16">
          <motion.h2 className="font-serif text-7xl md:text-9xl font-bold"
            initial={{ y: 100 }} animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >Contact</motion.h2>
        </div>

        <DrawLine delay={0.4} className="h-px bg-white/10 mb-16 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              role: 'Organizer',
              name: 'Göker Avcı',
              links: [
                { label: 'goker@alalea.com.tr', href: 'mailto:goker@alalea.com.tr' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/goker-avci/' },
              ],
            },
            {
              role: 'Organizer',
              name: 'Pınar Öncel',
              links: [
                { label: 'pinar@alalea.com.tr', href: 'mailto:pinar@alalea.com.tr' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pinaroncel/' },
              ],
            },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 + i * 0.15 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-4">{c.role}</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-6">{c.name}</h3>
              <div className="space-y-3">
                {c.links.map((link, j) => (
                  <motion.a key={j} href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                    whileHover={{ x: 5 }} transition={{ duration: 0.2 }}
                  >
                    {link.label}
                    {!link.href.startsWith('mailto') && <ExternalLink className="w-3 h-3" />}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 px-10 lg:px-20 py-8 border-t border-white/[0.05] flex justify-between items-center text-[10px] font-medium uppercase tracking-widest text-white/15"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 }}
      >
        <span>CDR Stage Towards COP31</span>
        <span>Presented by Alalea Decarbonization and Carbon Markets Advisory</span>
      </motion.div>
    </section>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export function Presentation() {
  const sections = [
    { id: 'cover', label: 'Cover' },
    { id: 'purpose', label: 'Purpose' },
    { id: 'practice', label: 'CDR' },
    { id: 'momentum', label: 'Momentum' },
    { id: 'team', label: 'Team' },
    { id: 'series', label: 'Series' },
    { id: 'flagship', label: 'Flagship' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'contact', label: 'Contact' },
  ];

  const sectionIds = sections.map(s => s.id);
  const active = useActiveSection(sectionIds);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="relative font-sans selection:bg-black selection:text-white">

      {/* Nav dots */}
      {(() => {
        const lightSections = ['purpose', 'practice', 'partnership'];
        const isLight = lightSections.includes(active);
        return (
          <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
            <TooltipProvider delayDuration={0}>
              {sections.map(s => (
                <Tooltip key={s.id}>
                  <TooltipTrigger asChild>
                    <button onClick={() => scrollTo(s.id)} className="p-2 focus:outline-none flex items-center justify-center">
                      <motion.span
                        className={`block rounded-full ${isLight ? 'bg-black' : 'bg-white'}`}
                        animate={active === s.id ? { width: 10, height: 10, opacity: 1 } : { width: 5, height: 5, opacity: 0.3 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-white text-black border-none text-xs font-bold uppercase tracking-wider rounded-none shadow-xl mr-2">
                    {s.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        );
      })()}

      <main>
        <Section1Cover />
        <Section2Purpose />
        <Section3Practice />
        <Section4Momentum />
        <Section5Team />
        <Section6Series />
        <Section7Flagship />
        <Section8Partnership />
        <Section9Contact />
      </main>
    </div>
  );
}
