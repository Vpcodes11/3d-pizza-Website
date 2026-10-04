import FoodImage, { type MaskedAsset } from "./FoodImage";
import masks from "@/lib/asset-masks.json";

export default function FloatingIngredient({ assets, position, depth, rotation }: { assets: MaskedAsset[]; position: string; depth: number; rotation: number }) {
  return <div className={`ingredient ingredient--${position}`} data-enter="ingredient" data-ingredient-depth={depth} aria-hidden="true">
    <div data-parallax data-depth={depth}>
      <div className="ingredient-float" data-float><div className="ingredient-variants" style={{ transform: `rotate(${rotation}deg)`, aspectRatio: `${masks[assets[0]].width} / ${masks[assets[0]].height}` }}>
        {assets.map((asset, index) => <div key={index} className="ingredient-variant" data-flavor-layer={index} style={{ opacity: index === 0 ? 1 : 0 }}><FoodImage asset={asset} className="ingredient-image" /></div>)}
      </div></div>
    </div>
  </div>;
}
