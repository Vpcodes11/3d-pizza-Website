"use client";

import { useEffect, useRef, useState } from "react";
import FoodImage from "./FoodImage";
import { pizzas } from "@/lib/pizzas";
import { demoLocation, formatPrice, menuDetails } from "@/lib/menu";

export default function OrderDialog({ open, quantities, onChangeQuantity, onClose, onClear }: {
  open: boolean; quantities: number[]; onChangeQuantity: (index: number, delta: number) => void; onClose: () => void; onClear: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const [receipt, setReceipt] = useState<{ quantities: number[]; total: number } | null>(null);
  const total = quantities.reduce((sum, quantity, i) => sum + quantity * menuDetails[i].price, 0);
  const count = quantities.reduce((sum, quantity) => sum + quantity, 0);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  useEffect(() => { if (receipt) confirmation.current?.focus(); }, [receipt]);
  const close = () => { onClose(); setReceipt(null); };

  return <dialog ref={ref} className="hero-dialog order-dialog" aria-labelledby="order-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  }}>
    <button className="dialog-close" aria-label="Close order" onClick={close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
    <p className="eyebrow">FRESH FROM THE FIRE</p>
    <h2 id="order-title">{receipt ? "A taste of what’s to come." : "Your next great pizza."}</h2>
    <p className="demo-message">Demo ordering · Sample prices. No payment is taken and no order is sent.</p>
    {receipt ? <div className="order-receipt" role="status"><h3 ref={confirmation} tabIndex={-1}>Demo order complete</h3><p>Your sample pickup order:</p><ul>{receipt.quantities.map((quantity, index) => quantity > 0 && <li key={pizzas[index].asset}>{quantity} × {pizzas[index].name}<span>{formatPrice(quantity * menuDetails[index].price)}</span></li>)}</ul><div className="order-total"><span>Sample total</span><strong>{formatPrice(receipt.total)}</strong></div><p>Thanks for trying FORNO. This is a preview, so there’s nothing to collect.</p><button className="button-primary" onClick={close}>Keep exploring</button></div>
      : count === 0 ? <div className="empty-order"><p>Your table is waiting.<br />Start with a classic from our menu.</p><a className="button-primary" href="#menu" onClick={close}>Explore the menu →</a></div>
      : <><ul className="order-items">{pizzas.map((pizza, index) => quantities[index] > 0 && <li key={pizza.asset}><FoodImage asset={pizza.asset} /><div className="order-item-info"><h3>{pizza.name}</h3><span>{formatPrice(menuDetails[index].price)} each</span><div className="quantity-control"><button aria-label={`Remove one ${pizza.name}`} onClick={() => onChangeQuantity(index, -1)}>−</button><output aria-label={`${pizza.name} quantity`}>{quantities[index]}</output><button aria-label={`Add one ${pizza.name}`} disabled={quantities[index] >= 20} onClick={() => onChangeQuantity(index, 1)}>+</button></div></div><strong>{formatPrice(quantities[index] * menuDetails[index].price)}</strong></li>)}</ul>
      <div className="pickup-note"><span className="eyebrow">SAMPLE PICKUP LOCATION</span><p>{demoLocation.address}<br /><span>{demoLocation.hours}</span></p></div>
      <div className="order-total" aria-live="polite"><span>Total · {count} {count === 1 ? "pizza" : "pizzas"}</span><strong>{formatPrice(total)}</strong></div><p className="order-price-note">Sample total includes all charges. Demo pickup only.</p><button className="button-primary order-submit" onClick={() => { setReceipt({ quantities: [...quantities], total }); onClear(); }}>Complete demo order →</button><a className="continue-menu" href="#menu" onClick={close}>Keep browsing the menu</a></>}
  </dialog>;
}
