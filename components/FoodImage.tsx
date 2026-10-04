import { useId } from "react";
import masks from "@/lib/asset-masks.json";

export type MaskedAsset = keyof typeof masks;

/** SVG clips hide baked-in backgrounds; the original JPEG pixels are unchanged. */
export default function FoodImage({ asset, label, className = "" }: { asset: MaskedAsset; label?: string; className?: string }) {
  const clipId = useId().replace(/:/g, "");
  const mask = masks[asset];
  return <svg viewBox={mask.viewBox} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    {label && <title>{label}</title>}
    <defs><clipPath id={clipId}><path d={mask.path} clipRule="evenodd" /></clipPath></defs>
    <image href={`/assets/${asset}.jpg`} width="1200" height="896" clipPath={`url(#${clipId})`} />
  </svg>;
}
