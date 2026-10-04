"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import type { PizzaTransform } from "./pizzas";

export default function usePizzaDepth(root: RefObject<HTMLElement | null>, base: RefObject<PizzaTransform>) {
  useEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" }, context => {
      if (!context.conditions?.motion) return;
      const position = hero.querySelector<HTMLElement>(".pizza-position");
      const surface = hero.querySelector<HTMLElement>("[data-pizza-depth]");
      if (!position || !surface) return;
      const offsets = { rotationX: 0, rotationY: 0, approach: 0 };
      const toX = gsap.quickTo(offsets, "rotationX", { duration: .65, ease: "power3.out" });
      const toY = gsap.quickTo(offsets, "rotationY", { duration: .65, ease: "power3.out" });
      const toApproach = gsap.quickTo(offsets, "approach", { duration: .8, ease: "power3.out" });
      // GSAP owns the damped values; write their composed CSS transform once per
      // frame so its transform aliases cannot overwrite independently owned axes.
      const setTransform = (value: string) => { surface.style.transform = value; };
      let bounds = position.getBoundingClientRect();
      const measure = () => { bounds = position.getBoundingClientRect(); };
      const resize = new ResizeObserver(measure);
      resize.observe(hero);
      resize.observe(position);
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        const x = (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
        const y = (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);
        const clamp = gsap.utils.clamp(-1, 1);
        toX(-clamp(y) * 12);
        toY(clamp(x) * 14);
        toApproach(gsap.utils.clamp(0, 1, 1 - Math.hypot(x, y) / 1.4));
        hero.style.setProperty("--light-x", `${50 + clamp(x) * 12}%`);
        hero.style.setProperty("--light-y", `${48 + clamp(y) * 10}%`);
      };
      const reset = () => { toX(0); toY(0); toApproach(0); };
      if (context.conditions.fine) {
        hero.addEventListener("pointermove", move, { passive: true });
        hero.addEventListener("pointerleave", reset);
      }
      let inView = true;
      let time = 0;
      const tick = (_time: number, delta: number) => {
        time += Math.min(delta, 50) / 1000;
        const value = base.current;
        const idleX = Math.sin(time * .42) * 3;
        const idleY = Math.sin(time * .32) * 4;
        const float = Math.sin(time * .8) * 9;
        const rotationZ = Math.sin(time * .2) * 4;
        setTransform(`translate3d(${value.positionX}px,${value.positionY + float}px,${value.positionZ}px) rotateX(${value.rotationX + 16 + offsets.rotationX + idleX}deg) rotateY(${value.rotationY - 5 + offsets.rotationY + idleY}deg) rotateZ(${value.rotationZ - 8 + rotationZ}deg) scale(${value.scale * (1 + offsets.approach * .035)})`);
        hero.style.setProperty("--shadow-scale", String(1 - float / 75));
        hero.style.setProperty("--shadow-opacity", String(.38 - float / 120));
      };
      const sync = () => {
        gsap.ticker.remove(tick);
        if (inView && !document.hidden) gsap.ticker.add(tick);
      };
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: .05 });
      observer.observe(hero);
      sync();
      document.addEventListener("visibilitychange", sync);
      window.addEventListener("scroll", measure, { passive: true });
      return () => {
        gsap.ticker.remove(tick);
        gsap.killTweensOf(offsets);
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", reset);
        window.removeEventListener("scroll", measure);
        document.removeEventListener("visibilitychange", sync);
        observer.disconnect();
        resize.disconnect();
        surface.style.removeProperty("transform");
        for (const property of ["--light-x", "--light-y", "--shadow-scale", "--shadow-opacity"]) hero.style.removeProperty(property);
      };
    }, hero);
    return () => media.revert();
  }, [root, base]);
}
