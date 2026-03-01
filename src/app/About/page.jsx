"use client";

import "../../../lib/i18n.js";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import Image from "next/image";
import LogoLoop from "./LogoLoop";
import {
  motion,
  useInView,
} from "framer-motion";
import RedButton from "@/ui/button.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SHOWCASE = [
  {
    imgSrc: "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "about.name",
    textKey: "about.text",
    align: "left",
  },
  {
    imgSrc: "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "about.name",
    textKey: "about.text",
    align: "right",
  },
  {
    imgSrc: "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "about.name",
    textKey: "about.text",
    align: "left",
  },
  {
    imgSrc: "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "about.name",
    textKey: "about.text",
    align: "right",
  },
  {
    imgSrc: "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "about.name",
    textKey: "about.text",
    align: "left",
  }, 
];

function ShowcaseRow({ item, index }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = item.align === "left";

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${!isLeft ? "md:flex-row-reverse" : ""}`}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: isLeft ? -60 : 60 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="w-full md:w-3/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-transparent z-10 pointer-events-none" />
        <img
          src={item.imgSrc}
          alt=""
          className="w-full object-cover"
        />
        <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/50">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, x: isLeft ? 60 : -60 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="w-full md:w-2/5 space-y-4"
      >
        <motion.div
          className="w-12 h-1 bg-red-600 rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <h2 className="text-3xl font-bold text-white">{t(item.nameKey)}</h2>
        <p className="text-gray-400 leading-relaxed">{t(item.textKey)}</p>
      </motion.div>
    </motion.section>
  );
}

export default function About() {
  const { t } = useTranslation();

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const logoRef = useRef(null);
  const logoInView = useInView(logoRef, { once: true, margin: "-40px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div className="bg-black text-white overflow-x-hidden">

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center px-6 md:px-16 pt-24 pb-16 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-700/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-16 w-full relative z-10">

          <motion.div
            className="relative w-full md:w-1/2 flex-shrink-0"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={scaleIn}
              custom={0}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10" />
              <Image
                src="/start.webp"
                alt="Main Preview"
                width={1100}
                height={600}
                className="object-cover w-full"
                priority
              />
            </motion.div>

            <motion.div
              variants={scaleIn}
              custom={1}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="absolute z-20 -bottom-8 -left-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/10 cursor-pointer"
              style={{ width: 160, height: 220 }}
            >
              <Image src="/start.webp" alt="Preview 1" fill className="object-cover" />
            </motion.div>

            <motion.div
              variants={scaleIn}
              custom={2}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="absolute z-20 top-5 -right-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/10 cursor-pointer"
              style={{ width: 160, height: 220 }}
            >
              <Image src="/start.webp" alt="Preview 2" fill className="object-cover" />
            </motion.div>

            <motion.div
              variants={scaleIn}
              custom={3}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="absolute z-20 -bottom-15 right-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/10 cursor-pointer"
              style={{ width: 140, height: 190 }}
            >
              <Image src="/start.webp" alt="Preview 3" fill className="object-cover" />
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 space-y-6"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              {t("about.title")}
              <span className="text-red-500">.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
              {t("about.desc1")}
            </motion.p>

            <motion.p variants={fadeUp} custom={3} className="text-gray-500 leading-relaxed">
              {t("about.desc2")}
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-4 flex-wrap">
              <RedButton
  label={t("about.btn")}
  size="lg"
/>

            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.div
        ref={logoRef}
        initial={{ opacity: 0, y: 30 }}
        animate={logoInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-10"
      >
        <LogoLoop />
      </motion.div>

      <section className="py-10 px-6 md:px-16">
        <motion.div className="text-center mb-16">
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">{t("about.showcase")}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">{t("about.showcaseTitle")}</h2>
        </motion.div>

        {SHOWCASE.map((item, i) => (
          <ShowcaseRow key={i} item={item} index={i} />
        ))}
      </section>

      <section ref={ctaRef} className="py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-transparent to-red-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-700/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-gray-400 mb-10 text-lg">{t("about.ctaDesc")}</p>

          
<RedButton
  label={t("about.ctaBtn")}
  href="/register"
  size="lg"
  sx={{ px: "48px", py: "14px" }}
/>
        </motion.div>
      </section>
    </div>
  );
}