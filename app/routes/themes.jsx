import { Link } from "@remix-run/react";

export const meta = () => [{ title: "Theme Shop | nekoHub" }, { name: "description", content: "nekoHub Theme Shop is coming soon." }];

export default function Themes(){
  return <main className="coming-page"><div className="coming-grid"/><nav className="coming-nav"><Link className="logo" to="/"><span className="cat">(^._.^)</span><span>nekoHub</span></Link><Link className="back-home" to="/">← Back</Link></nav><section><span className="coming-cat">(^._.^)</span><h1>COMING<br/><em>SOON</em></h1></section><p className="coming-corner">THEME SHOP · nekoHub</p></main>;
}
