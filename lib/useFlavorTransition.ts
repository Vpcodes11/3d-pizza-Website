"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { flavorDistance, type CarouselMotion } from "./carouselMotion";
import { pizzas as flavors } from "./pizzas";

/** A continuous curved track drives the pizzas, names, and ingredients together. */
export default function useFlavorTransition(root: RefObject<HTMLElement | null>, selected: number, direction: number, motion: RefObject<CarouselMotion>, revision: number) {
  const tween = useRef<gsap.core.Tween | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const track = motion.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pizzas = [...hero.querySelectorAll<HTMLElement>(".pizza-variant")];
    const ingredients = [...hero.querySelectorAll<HTMLElement>(".ingredient-variant")];
    const panels = [...hero.querySelectorAll<HTMLElement>("[data-title-panel]")];
    const copy = [...hero.querySelectorAll<HTMLElement>("[data-flavor-copy-panel]")];
    const selector = [...hero.querySelectorAll<HTMLElement>(".pizza-name")];
    const caption = hero.querySelector<HTMLElement>(".scene-caption");
    const smoothStep = (value: number) => {
      const t = Math.max(0, Math.min(1, value));
      return t * t * (3 - 2 * t);
    };
    let travel = 38;
    const measure = () => { travel = hero.clientWidth <= 760 ? 28 : hero.clientWidth <= 1100 ? 20 : 38; };
    const resize = new ResizeObserver(() => { measure(); draw(); });
    const draw = () => {
      const progress = track.progress;
      hero.dataset.carouselProgress = progress.toFixed(3);
      if (caption) caption.style.opacity = reduced.matches ? "1" : String(1 - smoothStep(Math.abs(progress - Math.round(progress)) / .18));
      const floor = Math.floor(progress);
      const from = flavors[((floor % flavors.length) + flavors.length) % flavors.length].theme;
      const to = flavors[((floor + 1) % flavors.length + flavors.length) % flavors.length].theme;
      const mix = progress - floor;
      for (const key of ["background", "ink", "muted", "glow"] as const) {
        hero.style.setProperty(`--hero-${key}`, gsap.utils.interpolate(from[key], to[key], mix));
      }
      pizzas.forEach((element, index) => {
        const distance = flavorDistance(index, progress);
        const amount = Math.abs(distance);
        const angle = distance * Math.PI / 2;
        // Stay solid while rolling, then disappear only after retreating into
        // depth. The incoming pizza approaches from above; the outgoing rolls
        // down and away, so they pass each other instead of becoming ghosts.
        const arc = Math.min(amount, 1);
        const x = Math.sin(angle) * travel;
        const y = (distance < 0 ? 18 : -12) * Math.pow(arc, 1.35);
        const z = -Math.pow(arc, 1.35) * 520;
        const scale = 1 - arc * .4;
        const opacity = reduced.matches ? (amount < .01 ? 1 : 0) : 1 - smoothStep((amount - .56) / .44);
        element.style.visibility = amount < 1 ? "visible" : "hidden";
        element.style.opacity = String(opacity);
        element.style.transform = reduced.matches ? "none" : `translate3d(${x}%,${y}%,${z}px) rotateX(${Math.sin(angle) * 10}deg) rotateY(${-Math.sin(angle) * 38}deg) rotateZ(${distance * 125}deg) scale(${scale})`;
        element.style.zIndex = String(Math.round((2 - amount) * 10));
      });
      ingredients.forEach(element => {
        const distance = flavorDistance(Number(element.dataset.flavorLayer), progress);
        const amount = Math.abs(distance);
        const weight = Number(element.closest("[data-ingredient-depth]")?.getAttribute("data-ingredient-depth") || 24) / 24;
        element.style.opacity = String(reduced.matches ? (amount < .01 ? 1 : 0) : 1 - smoothStep((amount - .3) / .65));
        element.style.visibility = amount < .95 ? "visible" : "hidden";
        element.style.transform = reduced.matches ? "none" : `translate3d(${distance * 90 * weight}px,${Math.sin(distance * Math.PI) * 38 * weight}px,0) rotate(${distance * 42}deg) scale(${1 - Math.min(amount, 1) * .16})`;
      });
      panels.forEach((panel, index) => {
        const distance = flavorDistance(index, progress);
        panel.style.visibility = Math.abs(distance) < 1.05 ? "visible" : "hidden";
        panel.style.transform = `translate3d(0,${distance * 115}%,0)`;
      });
      copy.forEach((panel, index) => {
        const distance = flavorDistance(index, progress);
        panel.style.opacity = String(Math.max(0, 1 - Math.abs(distance) * 2));
        panel.style.visibility = Math.abs(distance) < .8 ? "visible" : "hidden";
        panel.style.transform = reduced.matches ? "none" : `translate3d(0,${distance * 18}px,0)`;
      });
      selector.forEach((button, index) => {
        const emphasis = Math.max(0, 1 - Math.abs(flavorDistance(index, progress)));
        button.style.transform = reduced.matches ? "none" : `translateY(${-emphasis * 2}px)`;
      });
    };
    track.draw = draw;
    measure();
    resize.observe(hero);
    const updatePreference = () => {
      tween.current?.kill();
      track.progress = selectedRef.current;
      track.target = selectedRef.current;
      track.dragging = false;
      draw();
    };
    draw();
    reduced.addEventListener("change", updatePreference);
    return () => { tween.current?.kill(); resize.disconnect(); reduced.removeEventListener("change", updatePreference); track.draw = () => {}; };
  }, [root, motion]);

  useLayoutEffect(() => {
    const track = motion.current;
    let target = selected + Math.round((track.progress - selected) / 4) * 4;
    if (direction > 0 && target < track.progress - .01) target += 4;
    if (direction < 0 && target > track.progress + .01) target -= 4;
    if (Math.abs(target - track.progress) > 3.99) target = track.progress;
    track.target = target;
    tween.current?.kill();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.progress = target; track.draw(); return;
    }
    tween.current = gsap.to(track, { progress: target, duration: Math.min(2.35, 1.5 + Math.abs(target - track.progress) * .22), ease: "power3.inOut", overwrite: true, onUpdate: track.draw });
    return () => { tween.current?.kill(); };
  }, [root, selected, direction, motion, revision]);
}
