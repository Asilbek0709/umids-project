import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";

// ─── Config ──────────────────────────────────────────────────────────────────
const SMOOTH_TAU = 0.25;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

// ─── Logo data ────────────────────────────────────────────────────────────────
const logos = [
  {
    name: "Next.js",
    url: "https://nextjs.org",
    bg: "#000",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <circle cx="20" cy="20" r="14" fill="white" />
        <path d="M14 27V13l14 16h-4L14 17v10z" fill="black" />
        <path d="M22 13h4v9l-4-4.5V13z" fill="black" />
      </svg>
    ),
  },
  {
    name: "Tailwind",
    url: "https://tailwindcss.com",
    bg: "#06B6D4",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <path
          d="M20 10c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.285 1.955 1.113 2.857 2.03C22.07 17.327 23.614 19 27 19c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.285-1.955-1.113-2.857-2.03C24.93 11.673 23.386 10 20 10zm-7.5 9c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.285 1.955 1.113 2.857 2.03C15.57 26.327 17.114 28 20.5 28c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.285-1.955-1.113-2.857-2.03C17.43 20.673 15.886 19 12.5 19z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: "Motion",
    url: "https://motion.dev",
    bg: "#8B5CF6",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <circle cx="20" cy="20" r="5" fill="white" />
        <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "MUI",
    url: "https://mui.com",
    bg: "#007FFF",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <path d="M8 28V16l8 4.5V28l-8-0z" fill="white" opacity="0.9" />
        <path d="M16 20.5L24 16v12l-8-0v-7.5z" fill="white" />
        <path d="M24 16l8-4.5V24l-8 4V16z" fill="white" opacity="0.7" />
      </svg>
    ),
  },
  {
    name: "Figma",
    url: "https://figma.com",
    bg: "#F24E1E",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <rect x="10" y="6" width="10" height="10" rx="5" fill="#FF7262" />
        <rect x="20" y="6" width="10" height="10" rx="5" fill="white" />
        <rect x="10" y="16" width="10" height="10" rx="5" fill="#A259FF" />
        <circle cx="25" cy="21" r="5" fill="#1ABCFE" />
        <rect x="10" y="26" width="10" height="10" rx="5" fill="#0ACF83" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com",
    bg: "#24292E",
    text: "#fff",
    symbol: (
      <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 6a14 14 0 00-4.427 27.29c.7.128.956-.304.956-.675 0-.333-.012-1.213-.019-2.382-3.893.846-4.716-1.877-4.716-1.877-.636-1.616-1.553-2.046-1.553-2.046-1.27-.868.096-.85.096-.85 1.404.098 2.143 1.44 2.143 1.44 1.25 2.14 3.277 1.52 4.075 1.163.127-.904.49-1.521.89-1.87-3.108-.353-6.375-1.554-6.375-6.918 0-1.527.546-2.775 1.44-3.754-.144-.354-.624-1.776.136-3.702 0 0 1.174-.376 3.845 1.433A13.39 13.39 0 0120 13.48c1.188.006 2.384.161 3.504.472 2.668-1.81 3.84-1.433 3.84-1.433.762 1.926.282 3.348.138 3.702.896.979 1.438 2.227 1.438 3.754 0 5.378-3.272 6.56-6.39 6.907.502.433.949 1.29.949 2.599 0 1.876-.017 3.387-.017 3.848 0 .374.252.81.962.673A14.001 14.001 0 0020 6z"
          fill="white"
        />
      </svg>
    ),
  },
];

// ─── Animation hook (same logic as Document 1) ───────────────────────────────
const useAnimationLoop = (trackRef, speed, seqWidth, isHovered, hoverSpeed) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const dt = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : speed;
      const ease = 1 - Math.exp(-dt / SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * ease;

      if (seqWidth > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = next;
        track.style.transform = `translate3d(${-next}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimestampRef.current = null;
    };
  }, [speed, seqWidth, isHovered, hoverSpeed, trackRef]);
};

// ─── LogoCard (MUI-based) ─────────────────────────────────────────────────────
const LogoCard = memo(({ logo }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        flexShrink: 0,
        width: 200,
        height: 140,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        background: logo.bg,
        color: logo.text,
        border: logo.bg === "#fff" ? "1px solid #e5e5e5" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 4px 32px ${logo.bg}44, 0 1px 3px rgba(0,0,0,0.5)`,
        cursor: "pointer",
        userSelect: "none",
        transform: hovered ? "translateY(-6px) scale(1.04)" : "translateY(0) scale(1)",
        transition: "transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: "transform",
      }}
    >
      {logo.symbol}
      <Typography
        variant="body2"
        sx={{
          fontFamily: "'Georgia', serif",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: logo.text,
          opacity: 0.9,
          fontSize: "0.875rem",
        }}
      >
        {logo.name}
      </Typography>
    </Link>
  );
});

// ─── LogoLoop ─────────────────────────────────────────────────────────────────
const ITEM_WIDTH = 200;
const GAP = 24;
const SPEED = 80; // px/s — smooth continuous scroll

const LogoLoop = memo(() => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  // Measure sequence width and compute copies needed
  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const needed = Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM;
      setCopyCount(Math.max(MIN_COPIES, needed));
    }
  }, []);

  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener("resize", updateDimensions);
      updateDimensions();
      return () => window.removeEventListener("resize", updateDimensions);
    }
    const obs = new ResizeObserver(updateDimensions);
    if (containerRef.current) obs.observe(containerRef.current);
    if (seqRef.current) obs.observe(seqRef.current);
    updateDimensions();
    return () => obs.disconnect();
  }, [updateDimensions]);

  useAnimationLoop(trackRef, SPEED, seqWidth, isHovered, 0);

  const lists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, ci) => (
        <Box
          key={`copy-${ci}`}
          component="ul"
          ref={ci === 0 ? seqRef : undefined}
          aria-hidden={ci > 0}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: `${GAP}px`,
            listStyle: "none",
            padding: 0,
            margin: 0,
            flexShrink: 0,
          }}
        >
          {logos.map((logo, i) => (
            <Box component="li" key={`${ci}-${i}`} sx={{ display: "flex" }}>
              <LogoCard logo={logo} />
            </Box>
          ))}
        </Box>
      )),
    [copyCount]
  );

  return (
    <Box
      sx={{
        py: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* Heading */}
      <Box sx={{ mb: 8, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Shu saytni yaratish uchun ishlatilgan texnologiyalar
        </Typography>
      </Box>

      {/* Track container */}
      <Box
        ref={containerRef}
        role="region"
        aria-label="Partner logos"
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <Box
          ref={trackRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: `${GAP}px`,
            willChange: "transform",
            py: 1,
            pl: "60px",
          }}
        >
          {lists}
        </Box>
      </Box>
    </Box>
  );
});

LogoLoop.displayName = "LogoLoop";
export default LogoLoop;