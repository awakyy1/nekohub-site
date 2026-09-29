import { useState } from "react";
import { Link } from "@remix-run/react";
import BrandLogo from "./BrandLogo";
import DotField from "./DotField";

export default function NewsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav" aria-label="Main navigation">
      <DotField className="nav-dots" />
      <BrandLogo to="/" />
      <div className={menuOpen ? "nav-links open" : "nav-links"}>
        <a href="/#product">Product</a>
        <a href="/#agent">Agent</a>
        <a href="/#product">Architecture</a>
        <Link to="/news" aria-current="page" className="current">News</Link>
        <Link to="/themes">Theme Shop</Link>
        <a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </div>
      <div className="nav-actions">
        <Link className="nav-cta" to="/#install">Install <span aria-hidden="true">↘</span></Link>
      </div>
      <button className="menu" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>≡</button>
    </nav>
  );
}
