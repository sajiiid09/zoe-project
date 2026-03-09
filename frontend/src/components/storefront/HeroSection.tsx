"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  topBannerConfig,
  heroSliderConfig,
  sideBannersConfig,
} from "@/data/hero-banners";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full mb-8 pt-4">
      {/* Top Banner */}
      <div className="w-full mb-4">
        <Link href={topBannerConfig.href} className="block w-full">
          {/* Using img tag with full width to preserve aspect ratio like reference */}
          <img
            src={topBannerConfig.imageDesktop}
            alt={topBannerConfig.alt}
            className="w-full h-auto object-cover rounded-md block"
          />
        </Link>
      </div>

      {/* Hero Carousel + Side Banners */}
      <div
        className="w-full max-w-full flex md:flex-row flex-col gap-4"
        style={{ display: 'flex', boxSizing: 'border-box' }}
      >
        {/* Left: Auto Banner Slider */}
        <div
          className="relative group min-w-0"
          style={{ flexGrow: 7, flexShrink: 0, flexBasis: 'calc(70% - 8px)' }}
        >
          <div className="overflow-hidden rounded-md w-full h-full" style={{ overflow: 'hidden' }} ref={emblaRef}>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
              {heroSliderConfig.map((slide) => (
                <div
                  key={slide.id}
                  style={{ flex: '0 0 100%', minWidth: 0, position: 'relative' }}
                >
                  <Link href={slide.href} className="block w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-auto object-cover rounded-md"
                      style={{ display: 'block' }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous slide"
          >
            <CaretLeft weight="bold" className="text-gray-800" size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next slide"
          >
            <CaretRight weight="bold" className="text-gray-800" size={24} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSliderConfig.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Side Banners */}
        <div
          className="min-w-0 h-full"
          style={{ flexGrow: 3, flexShrink: 0, flexBasis: 'calc(30% - 8px)', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {sideBannersConfig.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="block rounded-md overflow-hidden relative"
              style={{ flex: 1 }}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto object-cover rounded-md block"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
