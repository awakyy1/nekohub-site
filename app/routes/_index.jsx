import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import generated from "../content/generated";
import { fallbackContent } from "../content/fallback";
import { languageLabels, translatePage } from "../content/translations";
import GradientWaves from "../components/GradientWaves";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";

const content = { ...fallbackContent, ...(generated || {}) };
const renderHosts = [
  { name:"atlas", cpu:34, mem:46, disk:28, load:"1.12 0.96 0.74", net:"↓86 KB/s  ↑31 KB/s", up:"12d 4h" },
  { name:"boreal", cpu:22, mem:39, disk:35, load:"0.71 0.65 0.52", net:"↓62 KB/s  ↑24 KB/s", up:"8d 19h" },
  { name:"cirrus", cpu:47, mem:58, disk:42, load:"1.56 1.31 1.02", net:"↓119 KB/s  ↑43 KB/s", up:"21d 7h" },
  { name:"delta", cpu:18, mem:31, disk:25, load:"0.58 0.49 0.41", net:"↓44 KB/s  ↑17 KB/s", up:"4d 12h" },
  { name:"ember", cpu:61, mem:54, disk:48, load:"2.03 1.74 1.36", net:"↓142 KB/s  ↑58 KB/s", up:"31d 2h" },
  { name:"fjord", cpu:29, mem:43, disk:32, load:"0.94 0.81 0.67", net:"↓73 KB/s  ↑28 KB/s", up:"16d 9h" }
];

function Logo(){ return <a className="logo" href="#top" aria-label="nekoHub home"><span className="cat">(^._.^)</span><span>nekoHub</span></a>; }
function Arrow(){ return <span aria-hidden="true">↗</span>; }

function LanguagePicker({locale,onChange}){
  const locales=["en","pt","ja"];
  const next=()=>onChange(locales[(locales.indexOf(locale)+1)%locales.length]);
  return <div className="language"><button data-no-translate aria-label={`${languageLabels[locale]}. Change language`} onClick={next}>{locale==="ja"?"JP":locale.toUpperCase()}</button></div>;
}

function SoftwareRender(){
  return <div className="terminal-wrap software-render-wrap" aria-label="nekoHub version 0.5.0 demo mode interface">
    <div className="terminal-glow"/>
    <div className="software-render">
      <div className="software-head"><span className="software-logo">/\_/\ <b>nekoHub</b></span><span><b>atlas</b><i>Overview</i><i>Details</i><em>● live</em></span></div>
      <div className="fleet-summary"><strong>FLEET OVERVIEW</strong><div><span>systems</span><b>6 of 6 responding</b><span>load</span><b>35.2% average</b><span>reach</span><b>no unavailable hosts</b><span>risk</span><b>ember · cpu 61%</b></div></div>
      <div className="software-host-grid">{renderHosts.map((host,index)=><article key={host.name} className={index===0?"selected":""}>
        <header><strong>{index===0?"▸ ":""}{host.name}</strong><span>· NORMAL</span></header>
        <p><small>CPU</small><i style={{"--value":`${host.cpu}%`}}/><b>{host.cpu}%</b></p>
        <p><small>MEM</small><i style={{"--value":`${host.mem}%`}}/><b>{host.mem}%</b></p>
        <p><small>DSK</small><i style={{"--value":`${host.disk}%`}}/><b>{host.disk}%</b></p>
        <div className="host-foot"><span>load&nbsp; {host.load}</span><span>net&nbsp;&nbsp; {host.net}</span><span>up&nbsp;&nbsp;&nbsp; {host.up}&nbsp;&nbsp; 19ms</span></div>
      </article>)}</div>
      <div className="software-foot">Esc home · r refresh · m machines · s settings · q quit</div>
      <span className="source-badge">v0.5.0 · demo mode</span>
    </div>
  </div>;
}

function StoryCarousel(){
  const [slide,setSlide]=useState(0);
  const previous=()=>setSlide(current=>current===0?2:current-1);
  const next=()=>setSlide(current=>(current+1)%3);
  return <section id="product" className="story-carousel" data-reveal aria-label="Why nekoHub and who it is for">
    <div className="story-viewport" aria-live="polite">
      <div className="story-track" style={{transform:`translateX(-${slide*(100/3)}%)`}}>
        <article className="story-slide why-slide">
          <p className="section-kicker">01 / Why nekoHub</p>
          <h2>Fleet visibility should feel <em>instant</em>, not like another platform to operate.</h2>
          <p>nekoHub keeps the experience local, tactile, and fast. One terminal becomes the calm surface between you and every Linux machine you care about.</p>
        </article>
        <article className="story-slide people-slide">
          <div><p className="section-kicker">Made for people who run things</p><h2>From one quiet homelab to a fleet of restless VPSs.</h2></div>
          <div className="people-list">{[["Sysadmins","See every host without leaving the terminal."],["Homelabbers","Keep the lab organized, legible, and fun."],["DevOps + SRE","Inspect faster and stay compatible with existing observability."],["Terminal people","Use an interface that respects your keyboard and attention."]].map(([title,copy])=><div key={title}><h3>{title}</h3><p>{copy}</p></div>)}</div>
        </article>
        <article className="story-slide command-slide">
          <div><p className="section-kicker">Built for the command line</p><h2>Native signals.<br/>No dashboard tax.</h2><p>The nekoHub agent reads Linux directly. Metrics stay lightweight, structured, and available without a permanent SSH polling loop.</p></div>
          <div className="signal-stack"><div><span>/proc + /sys</span><strong>Linux-native telemetry</strong></div><div><span>agent.sock</span><strong>Local by default</strong></div><div><span>GET /metrics</span><strong>Prometheus ready</strong></div></div>
        </article>
      </div>
    </div>
    <div className="story-controls"><button onClick={previous} aria-label="Previous slide">←</button><span>0{slide+1} / 03</span><div>{[0,1,2].map(index=><button key={index} className={slide===index?"active":""} onClick={()=>setSlide(index)} aria-label={`Show slide ${index+1}`}/>)}</div><button onClick={next} aria-label="Next slide">→</button></div>
  </section>;
}

const demoSizes = [
  { id: "compact", label: "44 cols", value: "44 × 24" },
  { id: "medium", label: "88 cols", value: "88 × 30" },
  { id: "wide", label: "132 cols", value: "132 × 40" }
];

function RealApp(){
  return <div className="real-app" aria-label="nekoHub real application layout">
    <div className="real-app-head"><span><b>/\_/\</b> neko<span>Hub</span></span><nav><i>[1] Home</i><i>[2] Machines</i><i>[3] Settings</i></nav></div>
    <div className="real-machines"><small>machines 1</small><span>● local</span><span>No remote machines paired yet</span></div>
    <div className="real-grid">
      <article><strong>◆ local</strong><span>1 machine</span><em>● local · ready</em></article>
      <article className="add"><strong>+ New group</strong><span>Create a machine group</span><em>Enter to add</em></article>
    </div>
    <div className="real-app-foot">Tab header/cards · ←→ browse · Enter open · m machines · s settings · q quit</div>
  </div>;
}

function AdaptiveDemo(){
  const [size,setSize]=useState("wide");
  const current=demoSizes.find(item=>item.id===size);
  return <section id="live-demo" className="adaptive-demo" data-reveal>
    <div className="section-heading"><div><p className="section-kicker">The real application</p><h2>One TUI.<br/>Every terminal size.</h2></div><p>The interface follows the real Ratatui layout: cards reorganize as the terminal changes, keeping every action clear from a compact pane to a full-screen session.</p></div>
    <div className="size-controls" aria-label="Terminal size"><span>Resize the terminal</span>{demoSizes.map(item=><button key={item.id} className={size===item.id?"active":""} onClick={()=>setSize(item.id)}>{item.label}</button>)}</div>
    <div className="adaptive-stage">
      <div className={`adaptive-window ${size}`}>
        <div className="window-bar"><span><i/><i/><i/></span><b>nekohub | {current.value}</b><em>live layout</em></div>
        <RealApp/>
        <span className="resize-grip" aria-hidden="true">⌟</span>
      </div>
    </div>
  </section>;
}

export default function Index(){
  const [copied,setCopied]=useState(false); const [menu,setMenu]=useState(false); const [locale,setLocale]=useState("en"); const root=useRef(null);
  const copy=()=>{ navigator.clipboard?.writeText(content.install); setCopied(true); setTimeout(()=>setCopied(false),1800); };
  useEffect(()=>{const saved=localStorage.getItem("nekohub-locale");if(languageLabels[saved])setLocale(saved)},[]);
  useEffect(()=>{document.documentElement.lang=locale==="pt"?"pt-BR":locale;localStorage.setItem("nekohub-locale",locale);translatePage(root.current,locale)},[locale]);
  useEffect(()=>{ const els=[...document.querySelectorAll("[data-reveal]")]; const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("revealed")),{threshold:.14}); els.forEach(e=>obs.observe(e)); return()=>obs.disconnect(); },[]);
  return <div id="top" className="site-shell" ref={root}>
    <nav className="nav"><DotField className="nav-dots"/><Logo/><div className={menu?"nav-links open":"nav-links"}><a href="#product">Product</a><a href="#agent">Agent</a><a href="#architecture">Architecture</a><Link to="/themes">Theme Shop</Link><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">GitHub <Arrow/></a></div><div className="nav-actions"><LanguagePicker locale={locale} onChange={setLocale}/><a className="nav-cta" href="#install">Install <span>↘</span></a></div><button className="menu" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>≡</button></nav>

    <main>
      <section className="hero">
        <GradientWaves className="hero-waves"/>
        <div className="hero-copy"><a className="announcement" href="#install"><i/>{content.announcement}<span>→</span></a><p className="eyebrow">{content.eyebrow}</p><h1>{content.title.split("\n").map((line,i)=><span key={line} className={i?"accent-line":""}>{line}</span>)}</h1><p className="hero-intro">{content.intro}</p><div className="hero-actions"><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">View on GitHub <Arrow/></a></div></div>
        <SoftwareRender/>
      </section>

      <section id="install" className="install dot-grid-section" data-reveal><DotGrid className="section-dot-grid"/><div className="install-copy"><p className="section-kicker">Up and running</p><h2>One command.<br/>Your fleet, in view.</h2><p>Install the current release from the official APT repository. nekoHub is open source and built in public.</p><div className="install-links"><a href="https://awakyy1.github.io/nekohub" target="_blank" rel="noreferrer">APT repository <Arrow/></a><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Read the source <Arrow/></a></div></div><button className="command" onClick={copy} aria-label="Copy install command"><span className="prompt">$</span><code>{content.install}</code><span className={copied?"copy copied":"copy"}>{copied?"Copied":"Copy"}</span></button></section>

      <StoryCarousel/>

      <section id="agent" className="agent-section dot-grid-section" data-reveal>
        <DotGrid className="section-dot-grid"/>
        <div className="agent-copy"><p className="section-kicker">nekoHub agent</p><h2>A quiet Linux service that does one job well.</h2><p>It reads native system signals, keeps a short local history, and serves the TUI without root privileges. No permanent SSH polling loop, no heavy runtime.</p><a href="https://github.com/awakyy1/nekohub/tree/main/crates/nekohub-agent" target="_blank" rel="noreferrer">Explore the agent source <Arrow/></a></div>
        <div className="agent-panel">
          <div className="agent-panel-head"><span><i/> nekohub-agent.service</span><b>active (running)</b></div>
          <div className="agent-step"><small>01 · COLLECT</small><strong>/proc + /sys</strong><span>CPU · memory · disk · load · network</span></div>
          <div className="agent-pulse"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <div className="agent-step"><small>02 · SERVE</small><strong>/run/nekohub/agent.sock</strong><span>read-only · no root · 1 second samples</span></div>
          <div className="agent-step final"><small>03 · EXPORT</small><strong>127.0.0.1:9876/metrics</strong><span>Prometheus compatible · optional by design</span></div>
        </div>
      </section>

      <AdaptiveDemo/>

      <section id="architecture" className="architecture dot-grid-section" data-reveal><DotGrid className="section-dot-grid"/><div className="section-heading"><div><p className="section-kicker">A cleaner control loop</p><h2>SSH opens the door.<br/>The agent keeps watch.</h2></div><p>Discovery and operations still use SSH. Continuous metrics come from a purpose-built agent, so collection remains stable without holding remote sessions open.</p></div><div className="flow"><div className="flow-node"><small>YOU</small><strong>nekoHub TUI</strong><span>one keyboard-first workspace</span></div><div className="flow-line"><i/><b>SSH · DISCOVER + OPERATE</b><i/></div><div className="flow-node"><small>HOST</small><strong>nekoHub agent</strong><span>native Linux telemetry</span></div><div className="flow-line mint"><i/><b>METRICS · CONTINUOUS</b><i/></div><div className="flow-node compact"><small>EXPORT</small><strong>Prometheus</strong><span>optional, always compatible</span></div></div></section>

      <section className="final-cta" data-reveal><span className="big-cat">(^._.^)</span><h2>Linux fleet management,<br/><em>designed for the terminal.</em></h2><div><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Star on GitHub <Arrow/></a></div></section>
    </main>
    <footer><DotField className="footer-dots"/><Logo/><div><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="https://awakyy1.github.io/nekohub">APT</a><a href="#top">Back to top ↑</a></div></footer>
  </div>;
}
