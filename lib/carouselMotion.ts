export type CarouselMotion = { progress: number; target: number; dragging: boolean; draw: () => void };

export function createCarouselMotion(): CarouselMotion {
  return { progress: 0, target: 0, dragging: false, draw: () => {} };
}

/** Signed distance along a circular track; next/previous can cross 3 ↔ 0. */
export function flavorDistance(index: number, progress: number, count = 4) {
  return ((index - progress + count * 1.5) % count + count) % count - count / 2;
}

export function nearestFlavor(progress: number, count = 4) {
  return ((Math.round(progress) % count) + count) % count;
}
