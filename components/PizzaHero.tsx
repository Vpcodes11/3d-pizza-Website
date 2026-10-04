"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import FoodImage from "./FoodImage";
import FloatingIngredient from "./FloatingIngredient";
import OrbitGraphics from "./OrbitGraphics";
import ArrowIcon from "./ArrowIcon";
import useHeroMotion from "@/lib/useHeroMotion";
import usePizzaDepth from "@/lib/usePizzaDepth";
import useFlavorTransition from "@/lib/useFlavorTransition";
import PizzaSelector from "./PizzaSelector";
import useHeroPlayback from "@/lib/useHeroPlayback";
import { formatPrice, menuDetails } from "@/lib/menu";
import { pizzas, createPizzaTransform } from "@/lib/pizzas";
import { createCarouselMotion, nearestFlavor } from "@/lib/carouselMotion";

export default function PizzaHero({ onOrder, onAdd, cartCount }: { onOrder: () => void; onAdd: (index: number) => void; cartCount: number }) {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [direction, setDirection] = useState(1);
  const [revision, setRevision] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(true);
  const carousel = useRef(createCarouselMotion());
  const pizzaTransform = useRef(createPizzaTransform());
  const swipeStart = useRef<{ x: number; y: number; progress: number; width: number; horizontal: boolean; pointerId: number } | null>(null);
  const pizza = pizzas[selected];
  useHeroMotion(root);
  usePizzaDepth(root, pizzaTransform);
  useFlavorTransition(root, selected, direction, carousel, revision);

  const selectPizza = useCallback((index: number, moveDirection = 1) => {
    if (index === selected && Math.abs(carousel.current.progress - carousel.current.target) < .01) return;
    setDirection(moveDirection);
    setSelected(index);
    setRevision(value => value + 1);
  }, [selected]);
  const nextPizza = useCallback(() => selectPizza((selected + 1) % pizzas.length, 1), [selectPizza, selected]);
  useHeroPlayback(root, carousel, playing, selected, revision, nextPizza);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setMotionAllowed(!preference.matches); if (preference.matches) setPlaying(false); };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  const beginSwipe = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = carousel.current;
    swipeStart.current = { x: event.clientX, y: event.clientY, progress: track.progress, width: event.currentTarget.getBoundingClientRect().width, horizontal: false, pointerId: event.pointerId };
  };
  const moveSwipe = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (!start.horizontal && Math.abs(x) > 9 && Math.abs(x) > Math.abs(y) * 1.6) {
      start.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      gsap.killTweensOf(carousel.current);
      carousel.current.dragging = true;
    }
    if (start.horizontal) {
      carousel.current.progress = start.progress - x / (start.width * .7);
      carousel.current.draw();
    }
  };
  const finishSwipe = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    carousel.current.dragging = false;
    if (!start.horizontal) return;
    const step = x < 0 ? 1 : -1;
    let target = Math.round(carousel.current.progress);
    if (Math.abs(x) > 45 && Math.abs(y) < Math.abs(x) && Math.abs(target - start.progress) < .5) target = Math.round(start.progress) + step;
    const settleDirection = target >= carousel.current.progress ? 1 : -1;
    setDirection(settleDirection);
    setSelected(nearestFlavor(target));
    setRevision(value => value + 1);
  };
  const cancelSwipe = () => {
    if (!swipeStart.current?.horizontal) { swipeStart.current = null; return; }
    swipeStart.current = null;
    carousel.current.dragging = false;
    setSelected(nearestFlavor(carousel.current.progress));
    setDirection(Math.round(carousel.current.progress) >= carousel.current.progress ? 1 : -1);
    setRevision(value => value + 1);
  };

  return <section id="home" className="pizza-hero" ref={root} aria-labelledby="hero-title" data-selected-pizza={pizza.name}>
    <Navbar onOrder={onOrder} cartCount={cartCount} />
    <div className="scene-light" aria-hidden="true" />
    <div className="scene-grid" aria-hidden="true" />
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow" data-copy>{pizza.mood}</p>
      <h1 id="hero-title" className="title-carousel" aria-label={pizza.name} onPointerDown={beginSwipe} onPointerMove={moveSwipe} onPointerUp={finishSwipe} onPointerCancel={cancelSwipe}>{pizzas.map((flavor, index) => <span key={flavor.asset} className="title-panel" data-title-panel aria-hidden={index !== selected} style={{ visibility: index === 0 ? "visible" : "hidden" }}><span className="title-line"><span data-title>{flavor.name}<span className="title-period">.</span></span></span></span>)}</h1>
    </div>
    <div className="hero-art">
      <div className="scene-ground" data-parallax data-depth="-15" aria-hidden="true"><span /></div>
      <OrbitGraphics />
      <div className="pizza-position" onPointerDown={beginSwipe} onPointerMove={moveSwipe} onPointerUp={finishSwipe} onPointerCancel={cancelSwipe}>
        <div data-enter="pizza"><div data-parallax data-depth="10"><div className="pizza-perspective"><div data-pizza-depth className="pizza-float pizza-depth">
          <div className="pizza-stage">{pizzas.map((flavor, index) => <div key={flavor.asset} className="pizza-variant" data-flavor-layer={index} aria-hidden={index !== selected} style={{ opacity: index === 0 ? 1 : 0 }}>
            <div className="pizza-crust-depth" aria-hidden="true"><FoodImage asset={flavor.asset} className="pizza-image" /></div>
            <FoodImage asset={flavor.asset} label={`Wood-fired ${flavor.name} pizza`} className="pizza-image" />
            <div className="pizza-sheen" aria-hidden="true" />
          </div>)}</div>
        </div></div></div></div>
      </div>
      <OrbitGraphics front />
      <FloatingIngredient assets={pizzas.map(flavor => flavor.ingredients[0])} position="top" depth={42} rotation={-32} />
      <FloatingIngredient assets={pizzas.map(flavor => flavor.ingredients[1])} position="right" depth={24} rotation={18} />
      <FloatingIngredient assets={pizzas.map(flavor => flavor.ingredients[2])} position="bottom" depth={48} rotation={-24} />
      <FloatingIngredient assets={pizzas.map(flavor => flavor.ingredients[3])} position="lower" depth={20} rotation={136} />
      <FloatingIngredient assets={pizzas.map(flavor => flavor.ingredients[4])} position="seasoning" depth={12} rotation={20} />
      <div className="fire-seal" data-copy aria-label="Wood-fired. Made by hand.">
        <svg viewBox="0 0 110 110" aria-hidden="true"><defs><path id="seal-circle" d="M55,55 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" /></defs>
          <text><textPath href="#seal-circle" startOffset="0%">WOOD-FIRED · MADE BY HAND · </textPath></text>
          <path className="flame" d="M56 31c3 15 13 16 13 29 0 10-6 16-15 16S39 69 39 60c0-8 5-12 9-16-1 10 1 12 4 14 5-8 6-16 4-27Z" />
          <path className="flame-inner" d="M54 57c1 6 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12Z" />
        </svg>
      </div>
    </div>
    <div className="hero-details">
      <p className="eyebrow" data-copy>THE CLASSICS / 0{selected + 1}</p>
      <div className="flavor-copy" data-copy>{pizzas.map((flavor, index) => <div key={flavor.asset} className="flavor-copy-panel" data-flavor-copy-panel aria-hidden={index !== selected} style={{ opacity: index === 0 ? 1 : 0 }}>
        <p className="hero-tagline">{flavor.tagline}</p>
        <p className="hero-description">{flavor.description[0]}<br />{flavor.description[1]}</p>
      </div>)}</div>
      <p className="hero-interaction-hint" data-copy>Drag to discover <span aria-hidden="true">↔</span></p>
    </div>
    <div className="hero-order-panel">
      <p className="ingredient-note" data-copy>{pizza.note}</p>
      <div className="hero-price" data-copy><span>12-inch · fresh from the fire</span><strong>{formatPrice(menuDetails[selected].price)}</strong><span>Sample price</span></div>
      <div className="hero-actions" data-copy>
        <button className="button-primary" onClick={() => { onAdd(selected); onOrder(); }}>Order now <ArrowIcon diagonal /></button>
        <a className="button-secondary" href="#menu">Explore menu <ArrowIcon /></a>
      </div>
    </div>
    <div className="scene-caption" data-copy><span className="scene-caption-line" /> HAND-STRETCHED. WOOD-FIRED. <span className="scene-caption-line" /></div>
    <footer className="hero-footer" data-copy><span className="footer-left"><span className="footer-star">✳</span> FIND YOUR CLASSIC.</span><PizzaSelector selected={selected} onSelect={selectPizza} /><button className="hero-playback" disabled={!motionAllowed} aria-label={motionAllowed ? (playing ? "Pause automatic pizza changes" : "Play automatic pizza changes") : "Automatic motion disabled"} onClick={() => setPlaying(value => !value)}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>{motionAllowed ? (playing ? "Pause" : "Play") : "Motion off"}</button></footer>
    <span className="sr-only" aria-live="polite" aria-atomic="true">{pizza.name} pizza selected.</span>
  </section>;
}
