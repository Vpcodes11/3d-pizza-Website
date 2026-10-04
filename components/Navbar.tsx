import ArrowIcon from "./ArrowIcon";

export default function Navbar({ onOrder, cartCount }: { onOrder: () => void; cartCount: number }) {
  return <header className="navbar" data-copy>
    <a className="wordmark" href="/" aria-label="FORNO homepage">FORNO<span className="wordmark-dot">®</span></a>
    <nav aria-label="Main navigation" className="nav-links">
      <a href="#menu">Menu</a>
      <a href="#story">Our story</a>
      <a href="#locations">Locations</a>
    </nav>
    <button className="nav-order" onClick={onOrder}>Your order{cartCount > 0 && <span className="cart-count">{cartCount}</span>} <ArrowIcon diagonal /></button>
  </header>;
}
