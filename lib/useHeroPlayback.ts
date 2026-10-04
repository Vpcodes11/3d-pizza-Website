"use client";

import { useEffect, type RefObject } from "react";
import type { CarouselMotion } from "./carouselMotion";

/** Only cycle while the scene is visible and nobody is interacting with it. */
export default function useHeroPlayback(root: RefObject<HTMLElement | null>, motion: RefObject<CarouselMotion>, playing: boolean, selected: number, revision: number, onNext: () => void) {
  useEffect(() => {
    const hero = root.current;
    if (!hero || !playing) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || reduced.matches) return;
      timer = setTimeout(() => {
        const focused = document.activeElement;
        const interacting = motion.current.dragging || (hero.contains(focused) && !focused?.classList.contains("hero-playback")) || !!document.querySelector("dialog[open]");
        if (interacting) schedule();
        else onNext();
      }, 6500);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= .55; schedule(); }, { threshold: .55 });
    observer.observe(hero);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [root, motion, playing, selected, revision, onNext]);
}
