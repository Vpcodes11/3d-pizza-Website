"use client";

import { useState } from "react";
import PizzaHero from "./PizzaHero";
import FoodImage from "./FoodImage";
import ArrowIcon from "./ArrowIcon";
import OrderDialog from "./OrderDialog";
import DepthCard from "./DepthCard";
import { pizzas } from "@/lib/pizzas";
import { demoLocation, formatPrice, menuDetails } from "@/lib/menu";

const questions = [
  ["What makes a FORNO pizza?", "A thin centre, an airy crust and a little char from the wood-fired oven. We keep the toppings simple so every ingredient has its moment."],
  ["Do you have vegetarian options?", "Yes. Margherita, Four cheese and Veggie are our vegetarian choices. Pepperoni is the option for meat lovers."],
  ["What about allergies?", "Our sample menu contains wheat and milk. Before ordering from a real restaurant, check ingredient and cross-contact information with the team. This demo cannot accommodate allergy requests."],
  ["Can I order for pickup?", "Try our demo pickup flow: choose a pizza, adjust your basket and preview your order. Prices, hours and the address are sample data. No order or payment is sent to a restaurant."],
];

export default function FornoSite() {
  const [quantities, setQuantities] = useState<number[]>([0, 0, 0, 0]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const count = quantities.reduce((sum, quantity) => sum + quantity, 0);
  const changeQuantity = (index: number, delta: number) => {
    setQuantities(current => current.map((quantity, i) => i === index ? Math.max(0, Math.min(20, quantity + delta)) : quantity));
  };
  const addPizza = (index: number) => {
    changeQuantity(index, 1);
    setNotice(`${pizzas[index].name} added to your order.`);
  };

  return <>
    <a className="skip-link" href="#menu">Skip to menu</a>
    <main>
      <PizzaHero onAdd={addPizza} onOrder={() => setOrderOpen(true)} cartCount={count} />
      <section id="menu" className="menu-section section-pad" aria-labelledby="menu-title">
        <div className="section-heading">
          <div><p className="eyebrow">01 / THE MENU</p><h2 id="menu-title">Four classics.<br /><em>One great fire.</em></h2></div>
          <div className="section-intro"><p>A little tomato. A little cheese. A lot of care.<br />Find your favourite, fresh from the oven.</p><span className="small-label">12-inch pizzas · Sample prices in INR</span></div>
        </div>
        <div className="menu-toolbar"><div className="menu-filters" aria-label="Filter pizzas">
          <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All pizzas</button>
          <button aria-pressed={filter === "vegetarian"} onClick={() => setFilter("vegetarian")}>Vegetarian</button>
        </div><button className="text-link" onClick={() => setOrderOpen(true)}>View your order ({count}) <ArrowIcon /></button></div>
        <div className="menu-grid">
          {pizzas.map((pizza, index) => {
            const item = menuDetails[index];
            if (filter === "vegetarian" && !item.vegetarian) return null;
            return <DepthCard className="menu-card" key={pizza.asset}>
              <div className="menu-card-art"><span className="menu-number">0{index + 1}</span><FoodImage asset={pizza.asset} label={`${pizza.name} pizza`} /><span className="diet-label"><span className={item.vegetarian ? "diet-dot" : "diet-dot diet-dot--meat"} />{item.vegetarian ? "Vegetarian" : "Contains meat"}</span></div>
              <div className="menu-card-heading"><h3>{pizza.name}</h3><span>{formatPrice(item.price)}</span></div>
              <p>{item.ingredients}</p>
              <div className="menu-card-bottom"><span>{item.note}</span><button className="add-pizza" aria-label={`Add ${pizza.name} to order`} onClick={() => addPizza(index)}>Add to order <span aria-hidden="true">+</span></button></div>
            </DepthCard>;
          })}
        </div>
        <p className="menu-note" role="status" aria-live="polite">{notice || "Made for sharing. Or keeping all to yourself."}</p>
      </section>

      <section id="story" className="story-section section-pad" aria-labelledby="story-title">
        <div className="story-art" aria-hidden="true"><div className="story-ring" /><FoodImage asset="pizza-margherita" /><span className="story-art-note">A little char.<br />A lot of character.</span></div>
        <div className="story-copy"><p className="eyebrow">02 / OUR STORY</p><h2 id="story-title">Good things<br />take <em>a little time.</em></h2><p>FORNO means oven. And for us, that’s where everything begins. A ball of dough, a handful of thoughtful ingredients, and the simple pleasure of making something by hand.</p><p>We believe the best pizza gives every ingredient room to shine. A bright tomato sauce. Melting cheese. Fresh basil. A crust with just enough character.</p><a href="#menu" className="button-secondary">Find your classic <ArrowIcon /></a></div>
      </section>

      <section className="values-strip" aria-label="The FORNO philosophy">
        <div><span>01</span><h3>Made by hand.</h3><p>From the first stretch to the last slice.</p></div>
        <div><span>02</span><h3>Less, but better.</h3><p>Good ingredients, given room to shine.</p></div>
        <div><span>03</span><h3>Always with fire.</h3><p>A golden crust with a little character.</p></div>
      </section>

      <section id="locations" className="location-section section-pad" aria-labelledby="location-title">
        <div><p className="eyebrow">03 / COME ON OVER</p><h2 id="location-title">Your next<br /><em>favourite corner.</em></h2><p className="location-intro">A seat at the table. A pizza in the middle.<br />Good company takes care of the rest.</p></div>
        <DepthCard className="location-card"><span className="small-label">SAMPLE LOCATION</span><h3>{demoLocation.name}</h3><address>{demoLocation.address}<br />India</address><div className="location-hours"><span>Opening hours</span><strong>{demoLocation.hours}</strong></div><p>Pickup & dine-in · Demo restaurant details</p><button className="button-primary" onClick={() => setOrderOpen(true)}>Build a pickup order <ArrowIcon diagonal /></button></DepthCard>
      </section>

      <section id="faq" className="faq-section section-pad" aria-labelledby="faq-title"><div><p className="eyebrow">A FEW GOOD QUESTIONS</p><h2 id="faq-title">Before your<br /><em>first slice.</em></h2></div><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="closing-section" aria-labelledby="closing-title"><p className="eyebrow">GOOD INGREDIENTS. GREAT FIRE.</p><h2 id="closing-title">There’s a classic<br />with <em>your name on it.</em></h2><a href="#menu" className="button-primary">Choose your pizza <ArrowIcon /></a></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><a className="wordmark" href="#home" aria-label="Back to FORNO homepage">FORNO<span className="wordmark-dot">®</span></a><p>Wood-fired simplicity.<br />Made for good company.</p><nav aria-label="Footer navigation"><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#locations">Locations</a><a href="#faq">FAQ</a></nav><a className="text-link" href="#home">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FORNO</span><span>Demo website · Sample prices & locations. Orders are previews only.</span></div></footer>
    <OrderDialog open={orderOpen} quantities={quantities} onChangeQuantity={changeQuantity} onClose={() => setOrderOpen(false)} onClear={() => { setQuantities([0, 0, 0, 0]); setNotice(""); }} />
    {count > 0 && !orderOpen && <button className="floating-cart" onClick={() => setOrderOpen(true)} aria-label={`View your order, ${count} pizzas`}>Your order <span>{count}</span><ArrowIcon /></button>}
  </>;
}
