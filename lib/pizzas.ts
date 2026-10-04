import type { MaskedAsset } from "@/components/FoodImage";

export type PizzaFlavor = {
  name: string;
  asset: MaskedAsset;
  title: [string, string];
  tagline: string;
  description: [string, string];
  theme: { background: string; ink: string; muted: string; glow: string };
  mood: string;
  note: string;
  ingredients: [MaskedAsset, MaskedAsset, MaskedAsset, MaskedAsset, MaskedAsset];
};

export const pizzas: PizzaFlavor[] = [
  { name: "Margherita", asset: "pizza-margherita", title: ["MAR", "GHERITA"], tagline: "Wood-fired simplicity.", description: ["Tomato. Fior di latte.", "Fresh basil. Fire."], theme: { background: "#962f27", ink: "#f4ead8", muted: "#f0c9ad", glow: "#de7750" }, mood: "A LOVE LETTER TO THE CLASSICS", note: "Nothing extra. Everything it needs.", ingredients: ["basil", "mozzarella", "tomato", "basil", "seasoning"] },
  { name: "Pepperoni", asset: "pizza-pepperoni", title: ["PEP", "PERONI"], tagline: "A little heat. A lot of soul.", description: ["Tomato. Fior di latte.", "Pepperoni. Fire."], theme: { background: "#57241e", ink: "#ffead2", muted: "#efbc9f", glow: "#ce542f" }, mood: "FOR THE ONES WHO LIKE A LITTLE HEAT", note: "Bold by nature. Warm at heart.", ingredients: ["chilli", "mozzarella", "pepperoni", "basil", "seasoning"] },
  { name: "Four cheese", asset: "pizza-four-cheese", title: ["FOUR", "CHEESE"], tagline: "Rich, mellow, irresistible.", description: ["Four cheeses. One flame.", "Golden crust. Pure comfort."], theme: { background: "#e5c17d", ink: "#493018", muted: "#664827", glow: "#fff0c3" }, mood: "A LITTLE INDULGENCE GOES A LONG WAY", note: "Four of a kind. One beautiful bite.", ingredients: ["mozzarella", "mozzarella", "mozzarella", "basil", "seasoning"] },
  { name: "Veggie", asset: "pizza-veggie", title: ["VEG", "GIE"], tagline: "From the garden. To the fire.", description: ["Mushrooms. Peppers. Olives.", "Fresh basil. Fire."], theme: { background: "#344a35", ink: "#f2ead6", muted: "#cad5b0", glow: "#91ac66" }, mood: "A FRESH TAKE ON YOUR FAVOURITE CLASSIC", note: "Garden colour. Oven character.", ingredients: ["basil", "mushroom", "tomato", "onion", "seasoning"] },
];

/** GSAP-ready base transform. Degrees, CSS pixels, and unit scale.
 * Pointer and idle offsets are composed independently, never written here.
 */
export type PizzaTransform = {
  rotationX: number; rotationY: number; rotationZ: number;
  positionX: number; positionY: number; positionZ: number; scale: number;
};

export function createPizzaTransform(): PizzaTransform {
  return { rotationX: 0, rotationY: 0, rotationZ: 0, positionX: 0, positionY: 0, positionZ: 0, scale: 1 };
}
