import { pizzas } from "@/lib/pizzas";
import ArrowIcon from "./ArrowIcon";

export default function PizzaSelector({ selected, onSelect }: { selected: number; onSelect: (index: number, direction?: number) => void }) {
  return <div className="pizza-selector" role="group" aria-label="Choose a pizza">
    <button className="pizza-step pizza-step--previous" aria-label="Previous pizza" onClick={() => onSelect((selected + pizzas.length - 1) % pizzas.length, -1)}><ArrowIcon /></button>
    <div className="pizza-names">{pizzas.map((pizza, index) => <button key={pizza.asset} className="pizza-name" aria-pressed={selected === index} onClick={() => onSelect(index, index > selected ? 1 : -1)}>{pizza.name}</button>)}</div>
    <button className="pizza-step" aria-label="Next pizza" onClick={() => onSelect((selected + 1) % pizzas.length, 1)}><ArrowIcon /></button>
  </div>;
}
