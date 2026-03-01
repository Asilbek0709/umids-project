"use client";

import "../../../lib/i18n.js";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import RedButton from "@/ui/button.jsx";
import Contact from "@/app/Contact/page.jsx";

const navVariants = {
  hidden: { opacity: 0, y: -56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -14 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const btnVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
  },
};

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const NAV_LINKS = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/About" },
    { key: "nav.genres", href: "/Movies" },
    { key: "nav.contact", href: "/Contact" },
  ];

  const { scrollY } = useScroll();
  const spring = useSpring(scrollY, { stiffness: 80, damping: 22, mass: 0.4 });

  const outerPX = useTransform(spring, [0, 100], [0, 20]);
  const outerPY = useTransform(spring, [0, 100], [0, 10]);
  const navPX = useTransform(spring, [0, 100], [48, 24]);
  const navPY = useTransform(spring, [0, 100], [20, 10]);
  const navWidth = useTransform(spring, [0, 100], ["100%", "75%"]);
  const borderRadius = useTransform(spring, [0, 100], [0, 9999]);
  const bgColor = useTransform(
    spring,
    [0, 100],
    ["rgba(6,6,6,0)", "rgba(6,6,6,0.92)"],
  );
  const borderColor = useTransform(
    spring,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.10)"],
  );
  const boxShadow = useTransform(
    spring,
    [0, 100],
    ["0 4px 40px rgba(0,0,0,0)", "0 4px 40px rgba(0,0,0,0.85)"],
  );
  const gradientOp = useTransform(spring, [0, 100], [1, 0]);
  const blurVal = useTransform(spring, [0, 100], ["blur(0px)", "blur(22px)"]);


  const switchLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <AnimatePresence>
        <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
          <motion.div
            style={{ opacity: gradientOp }}
            className="pointer-events-none absolute inset-x-0 top-0 h-44
                       bg-gradient-to-b from-black/90 via-black/40 to-transparent"
          />

          <motion.div
            className="pointer-events-auto"
            style={{
              paddingLeft: outerPX,
              paddingRight: outerPX,
              paddingTop: outerPY,
              paddingBottom: outerPY,
            }}
          >
            <motion.nav
              variants={navVariants}
              initial="hidden"
              animate="visible"
              style={{
                borderRadius,
                backgroundColor: bgColor,
                borderColor,
                boxShadow,
                backdropFilter: blurVal,
                WebkitBackdropFilter: blurVal,
                paddingLeft: navPX,
                paddingRight: navPX,
                paddingTop: navPY,
                paddingBottom: navPY,
                width: navWidth,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              className="flex items-center justify-between border"
            >
              {/* ===================== LOGO ===================== */}
              <motion.div variants={logoVariants}>
                <Link href="/" className="no-underline select-none">
                  <motion.div
                    className="relative flex items-center"
                    whileHover={{ scale: 1.07, rotate: -3 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                  >
                    {/* Red glow — matches logo's red color */}
                    <span className="absolute -inset-3 rounded-xl blur-2xl bg-red-600/20 pointer-events-none" />

                    {/*
                      Logo rasm 1:1 kvadrat (1080×1080), lekin ichidagi motif
                      landscape (keng). Shuning uchun:
                        • w-16 h-16 → rasm to'liq ko'rinadi, kvadrat ko'rinish
                        • Yoki w-24 h-10 → faqat motifni kesib ko'rsatadi (object-cover)
                      Quyida object-contain bilan w-16 h-16 ishlatilgan —
                      eng xavfsiz variant. Kerak bo'lsa o'zgartirasiz.
                    */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        sizes="64px"
                        className="object-contain drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]"
                        priority
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
              {/* ================================================ */}

              <motion.ul
                className="hidden md:flex items-center gap-0.5 list-none m-0 p-0"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.28 },
                  },
                }}
              >
                {NAV_LINKS.map(({ key, href }) => (
                  <motion.li key={href} variants={childVariants}>
                    <NavLink href={href} label={t(key)} />
                  </motion.li>
                ))}
              </motion.ul>

              <div className="flex items-center gap-2">
                <motion.div
                  variants={childVariants}
                  className="flex items-center gap-1"
                >
                  {["uz", "ru"].map((lang) => (
                    <motion.button
                      key={lang}
                      onClick={() => switchLang(lang)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                      }}
                      className={[
                        "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
                        "border-0 cursor-pointer transition-all duration-200",
                        i18n.language === lang
                          ? "bg-red-600 text-white shadow-[0_0_12px_rgba(229,9,20,0.5)]"
                          : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white",
                      ].join(" ")}
                      style={{ fontFamily: "'Outfit','Nunito',sans-serif" }}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </motion.div>

                <RedButton
  label={t("auth.signUp")}
  href="/register"
  size="md"
  variants={btnVariants}
/>
              </div>
            </motion.nav>
          </motion.div>
        </div>
    </AnimatePresence>
  );
}

function NavLink({ href, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} className="no-underline">
      <motion.span
        className="relative block px-4 py-2 text-sm font-medium
                   text-gray-300 rounded-full cursor-pointer select-none"
        style={{ fontFamily: "'Outfit','Nunito',sans-serif" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          color: "#fff",
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18 }}
      >
        {label}
        <motion.span
          className="absolute bottom-1.5 left-4 right-4 h-px bg-red-600 rounded-full origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      </motion.span>
    </Link>
  );
}