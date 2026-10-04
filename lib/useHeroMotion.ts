"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

/** Separate entrance, ambient, and pointer layers so their transforms never collide. */
export default function useHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", pointer: "(hover: hover) and (pointer: fine)" }, (context) => {
      if (!context.conditions?.motion) return;
      const select = gsap.utils.selector(hero);
      const pizza = select('[data-enter="pizza"]');
      const ingredients = select('[data-enter="ingredient"]');
      const arcs = select('[data-orbit]');
      const title = select('[data-title-panel]:first-child [data-title]');
      const copy = select('[data-copy]');
      const pizzaBounds = pizza[0].getBoundingClientRect();
      const ingredientOffset = (element: HTMLElement, axis: 'x' | 'y') => {
        const bounds = element.getBoundingClientRect();
        return axis === 'x'
          ? (pizzaBounds.left + pizzaBounds.width / 2 - bounds.left - bounds.width / 2) * .2
          : (pizzaBounds.top + pizzaBounds.height / 2 - bounds.top - bounds.height / 2) * .2;
      };
      const ambient = gsap.timeline({ paused: true });

      select('[data-float]').forEach((element: HTMLElement, index: number) => {
        const depthIndex = index + 1;
        ambient.to(element, { y: depthIndex % 2 ? -9 : 7, x: depthIndex % 2 ? 4 : -5, duration: 3.8 + depthIndex * .7, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0);
      });
      select('[data-orbit-rotation]').forEach((element: HTMLElement) => {
        ambient.to(element, { rotation: 7 * Number(element.dataset.orbitDirection || 1), transformOrigin: '50% 50%', duration: 32, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0);
      });

      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => {
        gsap.set(copy, { clearProps: 'transform,opacity' });
        ambient.play();
      } });
      entrance.from(pizza, { x: 35, y: 85, rotation: -28, scale: .74, opacity: 0, duration: 1.85 }, .12)
        .from(arcs, { opacity: 0, strokeDashoffset: .35, duration: 1.4, stagger: .1 }, .25)
        .from(ingredients, { opacity: 0, x: (_, element) => ingredientOffset(element, 'x'), y: (_, element) => ingredientOffset(element, 'y'), scale: .75, duration: 1.3, stagger: .1 }, .4)
        .from(title, { yPercent: 110, rotation: 2, duration: 1.05, stagger: .1 }, .6)
        .from(copy, { opacity: 0, y: 15, duration: .8, stagger: .055 }, .9);

      const layers = select('[data-parallax]').map((element: HTMLElement) => ({
        depth: Number(element.dataset.depth || 1),
        x: gsap.quickTo(element, 'x', { duration: 1.15, ease: 'power3.out' }),
        y: gsap.quickTo(element, 'y', { duration: 1.15, ease: 'power3.out' }),
      }));
      const move = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        layers.forEach(layer => { layer.x(x * layer.depth); layer.y(y * layer.depth); });
      };
      const reset = () => layers.forEach(layer => { layer.x(0); layer.y(0); });
      if (context.conditions.pointer) {
        hero.addEventListener('pointermove', move, { passive: true });
        hero.addEventListener('pointerleave', reset);
      }
      let visible = true;
      const syncPlayback = () => {
        const active = visible && !document.hidden;
        if (!entrance.isActive() && entrance.progress() === 1) ambient.paused(!active);
        else entrance.paused(!active);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); }, { threshold: .05 });
      observer.observe(hero);
      document.addEventListener('visibilitychange', syncPlayback);
      return () => {
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', reset);
        document.removeEventListener('visibilitychange', syncPlayback);
        observer.disconnect();
      };
    }, hero);
    return () => media.revert();
  }, [root]);
}
