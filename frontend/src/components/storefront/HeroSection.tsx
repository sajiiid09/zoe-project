"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

import {
  topBannerConfig,
  heroSliderConfig,
  sideBannersConfig,
} from "@/data/hero-banners";

export function HeroSection() {
  const autoplayRef = useRef(Autoplay({ delay: 3600, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplayRef.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="hero-shell" aria-label="Featured offers">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="hero-top-banner"
      >
        <Link href={topBannerConfig.href} className="hero-banner-link" aria-label={topBannerConfig.alt}>
          <Image
            src={topBannerConfig.imageDesktop}
            alt={topBannerConfig.alt}
            width={2400}
            height={400}
            priority
            className="hero-banner-image"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </Link>
      </motion.div>

      <div className="hero-stage">
        <motion.div
          className="hero-carousel"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.52, delay: 0.04, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="hero-track-wrap" ref={emblaRef}>
            <div className="hero-track">
              {heroSliderConfig.map((slide) => (
                <div key={slide.id} className="hero-slide">
                  <Link href={slide.href} className="hero-slide-link" aria-label={slide.alt}>
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      width={1800}
                      height={760}
                      className="hero-slide-image"
                      sizes="(max-width: 980px) 100vw, 70vw"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-controls" aria-hidden={heroSliderConfig.length <= 1}>
            <button
              onClick={scrollPrev}
              className="hero-nav-btn"
              aria-label="Previous slide"
              type="button"
            >
              <CaretLeft weight="bold" size={22} />
            </button>
            <button
              onClick={scrollNext}
              className="hero-nav-btn"
              aria-label="Next slide"
              type="button"
            >
              <CaretRight weight="bold" size={22} />
            </button>
          </div>

          <div className="hero-dots" role="tablist" aria-label="Hero slides">
            {heroSliderConfig.map((slide, index) => {
              const active = index === selectedIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => scrollTo(index)}
                  className={`hero-dot ${active ? "is-active" : ""}`}
                  aria-label={`Go to ${slide.alt}`}
                  aria-current={active}
                  type="button"
                >
                  <span className="hero-dot-track" />
                  {active ? (
                    <motion.span
                      key={`${slide.id}-progress`}
                      className="hero-dot-progress"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 3.3, ease: "linear" }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="hero-side-stack"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {sideBannersConfig.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="hero-side-banner"
              aria-label={banner.alt}
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                width={1000}
                height={500}
                className="hero-side-image"
                sizes="(max-width: 980px) 100vw, 30vw"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
