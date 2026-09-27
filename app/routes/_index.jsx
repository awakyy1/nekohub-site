import { useEffect, useState } from "react";
import generated from "../content/generated";
import { fallbackContent } from "../content/fallback";

const content = { ...fallbackContent, ...(generated || {}) };
const machines = [
  ["edge-01", "debian", "18%", "42°", "online"],
  ["media", "ubuntu", "63%", "48°", "online"],
  ["backup", "arch", "07%", "37°", "online"],
  ["lab-pi", "raspbian", "—", "—", "sleeping"]
];

function Logo(){ return <a className="logo" href="#top" aria-label="nekoHub home"><span className="cat">(^._.^)</span><span>nekoHub</span></a>; }
function Arrow(){ return <span aria-hidden="true">↗</span>; }

function Terminal(){
  const [active, setActive] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setActive(v=>(v+1)%3),2600); return()=>clearInterval(id); },[]);
  return <div className="terminal-wrap" aria-label="nekoHub terminal interface preview">
    <div className="terminal-glow"/>
    <div className="terminal">
      <div className="terminal-top"><span className="brand-mini">(^._.^) nekoHub</span><span>fleet / overview</span><span className="live"><i/> live</span></div>
      <div className="machine-rail">{machines.map((m,i)=><button key={m[0]} className={active===i?"machine active":"machine"} onClick={()=>setActive(i)}><span>{m[0]}</span><small>{m[1]}</small><b className={m[4]}/></button>)}</div>
      <div className="terminal-body">
        <aside><span className="side-label">GROUPS</span><button className="selected">◆ All machines <em>4</em></button><button>◇ Production <em>2</em></button><button>◇ Homelab <em>2</em></button><div className="side-space"/><span className="side-label">QUICK VIEW</span><button>◌ Alerts <em>0</em></button><button>≡ Services <em>12</em></button></aside>
        <main className="terminal-main">
          <div className="term-heading"><div><small>SELECTED HOST</small><h3>{machines[active]?.[0] || "edge-01"}</h3></div><span className="host-status"><i/> connected</span></div>
          <div className="metric-grid"><div><small>CPU</small><strong>{machines[active]?.[2] || "18%"}</strong><span className="bars">▂▃▅▃▆▇▅▃</span></div><div><small>MEMORY</small><strong>3.8 <em>/ 8 GB</em></strong><span className="bar"><i/></span></div><div><small>TEMP</small><strong>{machines[active]?.[3] || "42°"}</strong><span className="mint">stable</span></div></div>
          <div className="activity"><div className="activity-head"><small>NETWORK · LAST 60S</small><span>↓ 12.4 MB/s &nbsp; ↑ 3.1 MB/s</span></div><div className="chart">{[18,24,20,38,29,44,35,58,43,67,54,61,48,72,62,76,55,69,64,82,70,78,60,74,65,86,73,80].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div></div>
          <div className="processes"><small>TOP PROCESSES</small><span>prometheus-node &nbsp; 3.2%</span><span>dockerd &nbsp; 1.8%</span></div>
        </main>
      </div>
      <div className="terminal-foot"><span>[?] help</span><span>[g] groups</span><span>[r] refresh</span><b>agent 0.3.1</b></div>
    </div>
  </div>;
}

export default function Index(){
  const [copied,setCopied]=useState(false); const [menu,setMenu]=useState(false);
  const copy=()=>{ navigator.clipboard?.writeText(content.install); setCopied(true); setTimeout(()=>setCopied(false),1800); };
  useEffect(()=>{ const els=[...document.querySelectorAll("[data-reveal]")]; const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("revealed")),{threshold:.14}); els.forEach(e=>obs.observe(e)); return()=>obs.disconnect(); },[]);
  return <div id="top" className="site-shell">
    <nav className="nav"><Logo/><div className={menu?"nav-links open":"nav-links"}><a href="#product">Product</a><a href="#architecture">Architecture</a><a href="#roadmap">Roadmap</a><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">GitHub <Arrow/></a></div><a className="nav-cta" href="#install">Install <span>↘</span></a><button className="menu" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>≡</button></nav>

    <main>
      <section className="hero">
        <div className="hero-copy"><a className="announcement" href="#install"><i/>{content.announcement}<span>→</span></a><p className="eyebrow">{content.eyebrow}</p><h1>{content.title.split("\n").map((line,i)=><span key={line} className={i?"accent-line":""}>{line}</span>)}</h1><p className="hero-intro">{content.intro}</p><div className="hero-actions"><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">View on GitHub <Arrow/></a></div></div>
        <Terminal/>
      </section>

      <div className="signal-strip"><span>RUST</span><i/><span>RATATUI</span><i/><span>TOKIO</span><i/><span>/PROC + /SYS</span><i/><span>PROMETHEUS</span><i/><span>UNIX SOCKET</span></div>

      <section id="product" className="statement" data-reveal><p className="section-kicker">01 / Why nekoHub</p><h2>Fleet visibility should feel <em>instant</em>, not like another platform to operate.</h2><p>nekoHub keeps the experience local, tactile, and fast. One terminal becomes the calm surface between you and every Linux machine you care about.</p></section>

      <section className="feature-stage" data-reveal>
        <div className="section-heading"><div><p className="section-kicker">Built for the command line</p><h2>Native signals.<br/>No dashboard tax.</h2></div><p>The nekoHub agent reads Linux directly. Metrics stay lightweight, structured, and available without a permanent SSH polling loop.</p></div>
        <div className="feature-grid"><article className="feature wide"><div className="feature-no">01</div><div className="proc-card"><div><span>/proc/loadavg</span><b>0.42 &nbsp; 0.31 &nbsp; 0.28</b></div><div><span>/sys/class/thermal</span><b>42.0°C</b></div><div><span>/proc/meminfo</span><b>4.2 GB free</b></div></div><h3>Linux-native telemetry</h3><p>Direct reads from <code>/proc</code> and <code>/sys</code> keep the agent transparent and efficient.</p></article><article className="feature"><div className="feature-no">02</div><div className="socket-art"><span>nekoHub</span><i>↔</i><span>agent.sock</span></div><h3>Local by default</h3><p>A Unix socket keeps host communication close, predictable, and easy to reason about.</p></article><article className="feature"><div className="feature-no">03</div><div className="prom-art"><span>GET /metrics</span><b>200 OK</b><code>nekohub_cpu 0.18</code></div><h3>Prometheus ready</h3><p>Use nekoHub's focused TUI and keep the monitoring stack you already trust.</p></article></div>
      </section>

      <section id="architecture" className="architecture" data-reveal><div className="section-heading"><div><p className="section-kicker">A cleaner control loop</p><h2>SSH opens the door.<br/>The agent keeps watch.</h2></div><p>Discovery and operations still use SSH. Continuous metrics come from a purpose-built agent, so collection remains stable without holding remote sessions open.</p></div><div className="flow"><div className="flow-node"><small>YOU</small><strong>nekoHub TUI</strong><span>one keyboard-first workspace</span></div><div className="flow-line"><i/><b>SSH · DISCOVER + OPERATE</b><i/></div><div className="flow-node"><small>HOST</small><strong>nekoHub agent</strong><span>native Linux telemetry</span></div><div className="flow-line mint"><i/><b>METRICS · CONTINUOUS</b><i/></div><div className="flow-node compact"><small>EXPORT</small><strong>Prometheus</strong><span>optional, always compatible</span></div></div></section>

      <section id="roadmap" className="roadmap" data-reveal><div className="section-heading"><div><p className="section-kicker">Now and next</p><h2>Useful today.<br/>Built for the long run.</h2></div><span className="version">CURRENT · v0.3.1</span></div><div className="roadmap-columns"><div><h3>Shipping now</h3>{["Local host monitoring","Machine inventory","Persistent groups","Prometheus metrics","Native /proc and /sys reads","APT installation"].map(x=><p key={x}><i>✓</i>{x}</p>)}</div><div className="future"><h3>On the horizon</h3>{["Secure remote agent pairing","Docker and Podman","Services and logs","Custom themes","Community theme store"].map((x,i)=><p key={x}><span>{String(i+1).padStart(2,"0")}</span>{x}</p>)}</div></div></section>

      <section className="audience" data-reveal><p className="section-kicker">Made for people who run things</p><div className="audience-grid"><h2>From one quiet homelab to a fleet of restless VPSs.</h2><div>{[["Sysadmins","See every host without leaving the terminal."],["Homelabbers","Keep the lab organized, legible, and fun."],["DevOps + SRE","Inspect faster and stay compatible with existing observability."],["Terminal people","Use an interface that respects your keyboard and attention."]].map(([t,p])=><article key={t}><h3>{t}</h3><p>{p}</p></article>)}</div></div></section>

      <section id="install" className="install" data-reveal><div className="install-copy"><p className="section-kicker">Up and running</p><h2>One command.<br/>Your fleet, in view.</h2><p>Install the current release from the official APT repository. nekoHub is open source and built in public.</p><div className="install-links"><a href="https://awakyy1.github.io/nekohub" target="_blank" rel="noreferrer">APT repository <Arrow/></a><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Read the source <Arrow/></a></div></div><button className="command" onClick={copy} aria-label="Copy install command"><span className="prompt">$</span><code>{content.install}</code><span className={copied?"copy copied":"copy"}>{copied?"Copied":"Copy"}</span></button></section>

      <section className="final-cta" data-reveal><span className="big-cat">(^._.^)</span><h2>Linux fleet management,<br/><em>designed for the terminal.</em></h2><div><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Star on GitHub <Arrow/></a></div></section>
    </main>
    <footer><Logo/><div><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="https://awakyy1.github.io/nekohub">APT</a><a href="#top">Back to top ↑</a></div></footer>
  </div>;
}
