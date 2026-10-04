"use client";

import type { ReactNode, PointerEvent } from "react";

export default function DepthCard({ className, children }: { className: string; children: ReactNode }) {
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.setProperty("--card-x", `${-y * 7}deg`);
    card.style.setProperty("--card-y", `${x * 7}deg`);
  };
  return <article className={`${className} depth-card`} onPointerMove={move} onPointerLeave={event => {
    event.currentTarget.style.setProperty("--card-x", "0deg");
    event.currentTarget.style.setProperty("--card-y", "0deg");
  }}>{children}</article>;
}
