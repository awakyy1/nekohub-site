import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import generated from "../content/generated";
import { fallbackContent } from "../content/fallback";
import { languageLabels, translatePage } from "../content/translations";
import GradientWaves from "../components/GradientWaves";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";

const content = { ...fallbackContent, ...(generated || {}) };
const installCommands = "sudo apt update\nsudo apt install -y curl\ncurl -fsSL https://awakyy1.github.io/nekohub/install.sh | sudo sh\nsudo apt install nekohub";
const renderHosts = [
  { name:"atlas", cpu:34, mem:46, disk:28, load:"1.12 0.96 0.74", net:"↓86 KB/s  ↑31 KB/s", up:"12d 4h" },
  { name:"boreal", cpu:22, mem:39, disk:35, load:"0.71 0.65 0.52", net:"↓62 KB/s  ↑24 KB/s", up:"8d 19h" },
  { name:"cirrus", cpu:47, mem:58, disk:42, load:"1.56 1.31 1.02", net:"↓119 KB/s  ↑43 KB/s", up:"21d 7h" },
  { name:"delta", cpu:18, mem:31, disk:25, load:"0.58 0.49 0.41", net:"↓44 KB/s  ↑17 KB/s", up:"4d 12h" },
  { name:"ember", cpu:61, mem:54, disk:48, load:"2.03 1.74 1.36", net:"↓142 KB/s  ↑58 KB/s", up:"31d 2h" },
  { name:"fjord", cpu:29, mem:43, disk:32, load:"0.94 0.81 0.67", net:"↓73 KB/s  ↑28 KB/s", up:"16d 9h" }
];

const renderThemes = [
  { name:"Sakura", primary:"#ef8bb5", secondary:"#f4ae97", tertiary:"#be9feb", success:"#7cdab5", background:"#140e12", surface:"#22171f", border:"#503345", text:"#f1e0e9", muted:"#916f82" },
  { name:"Ocean", primary:"#70a6ff", secondary:"#68cde1", tertiary:"#9184ee", success:"#68dab9", background:"#090f1a", surface:"#101c2e", border:"#2a4364", text:"#dae6f7", muted:"#647a97" },
  { name:"Ember", primary:"#eb6565", secondary:"#f19d5b", tertiary:"#da7289", success:"#7ecf91", background:"#160b0b", surface:"#271413", border:"#5b2d2b", text:"#f4e1da", muted:"#966960" },
  { name:"Violet", primary:"#b484ff", secondary:"#e884d3", tertiary:"#71a5f6", success:"#6fdac1", background:"#0f0a19", surface:"#1c132d", border:"#422f60", text:"#e9e0f7", muted:"#7e6b99" }
];

function Logo(){ return <a className="logo ascii-logo" href="#top" aria-label="nekoHub home"><pre>{" /\\       __        __ __     __ /\\\n  ___  ___ / /_____  / // /_ __/ /\n / _ \\/ -_)  '_/ _ \\/ _  / // / _ \\\n/_//_/\\__/_/\\_\\\\___/_//_/\\_,_/_.__/"}</pre></a>; }
function Arrow(){ return <span aria-hidden="true">↗</span>; }

function LanguagePicker({locale,onChange}){
  const locales=["en","pt","ja"];
  const next=()=>onChange(locales[(locales.indexOf(locale)+1)%locales.length]);
  return <div className="language"><button data-no-translate aria-label={`${languageLabels[locale]}. Change language`} onClick={next}>{locale==="ja"?"JP":locale.toUpperCase()}</button></div>;
}

function SoftwareRender({version}){
  const [themeIndex,setThemeIndex]=useState(0);
  const renderRef=useRef(null);
  useEffect(()=>{ const timer=setInterval(()=>setThemeIndex(index=>(index+1)%renderThemes.length),2800); return()=>clearInterval(timer); },[]);
  const theme=renderThemes[themeIndex];
  const themeStyle={"--tui-amber":theme.primary,"--tui-orange":theme.secondary,"--tui-cyan":theme.tertiary,"--tui-green":theme.success,"--tui-ink":theme.background,"--tui-surface":theme.surface,"--tui-line":theme.border,"--tui-text":theme.text,"--tui-dim":theme.muted};
  const move=event=>{ const box=event.currentTarget.getBoundingClientRect(); const x=(event.clientX-box.left)/box.width-.5; const y=(event.clientY-box.top)/box.height-.5; renderRef.current?.style.setProperty("--tilt-x",`${y*-3}deg`); renderRef.current?.style.setProperty("--tilt-y",`${x*4}deg`); renderRef.current?.style.setProperty("--render-lift","-2px"); renderRef.current?.style.setProperty("--glare-x",`${(x+.5)*100}%`); renderRef.current?.style.setProperty("--glare-y",`${(y+.5)*100}%`); };
  const reset=()=>{ renderRef.current?.style.setProperty("--tilt-x","0deg"); renderRef.current?.style.setProperty("--tilt-y","0deg"); renderRef.current?.style.setProperty("--render-lift","0px"); };
  return <div className="terminal-wrap software-render-wrap" onPointerMove={move} onPointerLeave={reset} aria-label={`nekoHub ${version} interface preview`}>
    <div className="terminal-glow"/>
    <div ref={renderRef} className="software-render" style={themeStyle}>
      <span key={themeIndex} className="theme-repaint" aria-hidden="true"/>
      <div className="software-head latest-head"><pre className="software-wordmark">{" /\\       __        __ __     __ /\\\n  ___  ___ / /_____  / // /_ __/ /\n / _ \\/ -_)  '_/ _ \\/ _  / // / _ \\\n/_//_/\\__/_/\\_\\\\___/_//_/\\_,_/_.__/"}</pre><span><i className="active">[1] Home</i><i>[2] Machines</i><i>[3] Settings</i></span></div>
      <div className="fleet-pulse"><strong>FLEET PULSE&nbsp; 4</strong><span>● atlas&nbsp; LOCAL AGENT</span><span>○ boreal</span><span>○ cirrus</span><span>○ delta</span><em>0 ALERTS</em></div>
      <div className="recent-title"><strong>RECENT MACHINES</strong><span>4 registered</span><em>● 4 ready</em></div>
      <div className="machine-shelf">{renderHosts.slice(0,4).map((host,index)=><article key={host.name} className={index===0?"selected":""}><strong>{host.name}</strong><span>{index===0?"local machine":"agent installed"}</span></article>)}</div>
      <div className="groups-title"><strong>GROUPS</strong><span>3 spaces</span><em>organize your fleet</em></div>
      <div className="group-grid"><article className="selected"><strong>◆ homelab</strong><span>2 machines</span><em>● group ready&nbsp;&nbsp; Enter ›</em></article><article><strong>◆ production</strong><span>1 machine</span><em>● group ready</em></article><article><strong>◆ edge</strong><span>1 machine</span><em>● group ready</em></article><article className="add"><strong>+ New group</strong><span>Create a friendly home</span><em>Enter to create</em></article></div>
      <div className="software-foot">Tab header/cards · ←→ browse · Enter open · m machines · s settings · q quit</div>
      <div className="render-theme-switcher" data-no-translate>{renderThemes.map((item,index)=><button key={item.name} className={themeIndex===index?"active":""} onClick={()=>setThemeIndex(index)} aria-label={`Use ${item.name} theme`}><i style={{background:item.primary}}/>{item.name}</button>)}</div>
      <span className="source-badge" data-no-translate>{theme.name} · {version}</span>
    </div>
  </div>;
}

function StoryCarousel(){
  const [slide,setSlide]=useState(0);
  const previous=()=>setSlide(current=>current===0?3:current-1);
  const next=()=>setSlide(current=>(current+1)%4);
  return <section id="product" className="story-carousel" data-reveal aria-label="Why nekoHub and who it is for">
    <div className="story-viewport" aria-live="polite">
      <div className="story-track" style={{transform:`translateX(-${slide*25}%)`}}>
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
        <article className="story-slide architecture-slide">
          <div className="section-heading"><div><p className="section-kicker">A cleaner control loop</p><h2>SSH opens the door.<br/>The agent keeps watch.</h2></div><p>Discovery and operations still use SSH. Continuous metrics come from a purpose-built agent, so collection remains stable without holding remote sessions open.</p></div>
          <div className="flow"><div className="flow-node"><small>YOU</small><strong>nekoHub TUI</strong><span>one keyboard-first workspace</span></div><div className="flow-line"><i/><b>SSH · DISCOVER + OPERATE</b><i/></div><div className="flow-node"><small>HOST</small><strong>nekoHub agent</strong><span>native Linux telemetry</span></div><div className="flow-line mint"><i/><b>METRICS · CONTINUOUS</b><i/></div><div className="flow-node compact"><small>EXPORT</small><strong>Prometheus</strong><span>optional, always compatible</span></div></div>
        </article>
      </div>
    </div>
    <div className="story-controls"><button onClick={previous} aria-label="Previous slide">←</button><span>0{slide+1} / 04</span><div>{[0,1,2,3].map(index=><button key={index} className={slide===index?"active":""} onClick={()=>setSlide(index)} aria-label={`Show slide ${index+1}`}/>)}</div><button onClick={next} aria-label="Next slide">→</button></div>
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
  const [copied,setCopied]=useState(false); const [menu,setMenu]=useState(false); const [locale,setLocale]=useState("en"); const [latestVersion,setLatestVersion]=useState("v0.9.0"); const root=useRef(null);
  const copy=()=>{ navigator.clipboard?.writeText(installCommands); setCopied(true); setTimeout(()=>setCopied(false),1800); };
  useEffect(()=>{const saved=localStorage.getItem("nekohub-locale");if(languageLabels[saved])setLocale(saved)},[]);
  useEffect(()=>{document.documentElement.lang=locale==="pt"?"pt-BR":locale;localStorage.setItem("nekohub-locale",locale);translatePage(root.current,locale)},[locale]);
  useEffect(()=>{ const els=[...document.querySelectorAll("[data-reveal]")]; const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("revealed")),{threshold:.14}); els.forEach(e=>obs.observe(e)); return()=>obs.disconnect(); },[]);
  useEffect(()=>{ const controller=new AbortController(); fetch("https://api.github.com/repos/awakyy1/nekohub/releases/latest",{signal:controller.signal,headers:{Accept:"application/vnd.github+json"}}).then(response=>response.ok?response.json():Promise.reject()).then(release=>{ const tag=String(release.tag_name||""); if(/^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(tag)) setLatestVersion(tag.startsWith("v")?tag:`v${tag}`); }).catch(()=>{}); return()=>controller.abort(); },[]);
  const releaseText=locale==="pt"?`${latestVersion} · disponível via APT`:locale==="ja"?`${latestVersion} · APTで配布中`:`${latestVersion} · now available through APT`;
  return <div id="top" className="site-shell" ref={root}>
    <nav className="nav"><DotField className="nav-dots"/><Logo/><div className={menu?"nav-links open":"nav-links"}><a href="#product">Product</a><a href="#agent">Agent</a><a href="#product">Architecture</a><Link to="/themes">Theme Shop</Link><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">GitHub <Arrow/></a></div><div className="nav-actions"><LanguagePicker locale={locale} onChange={setLocale}/><a className="nav-cta" href="#install">Install <span>↘</span></a></div><button className="menu" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>≡</button></nav>

    <main>
      <section className="hero">
        <GradientWaves className="hero-waves"/>
        <div className="hero-copy"><a className="announcement" data-no-translate href="#install">{releaseText}<span>→</span></a><p className="eyebrow">{content.eyebrow}</p><h1>{content.title.split("\n").map((line,i)=><span key={line} className={i?"accent-line":""}>{line}</span>)}</h1><p className="hero-intro">{content.intro}</p><div className="hero-actions"><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">View on GitHub <Arrow/></a></div></div>
        <SoftwareRender version={latestVersion}/>
      </section>

      <section id="install" className="install dot-grid-section" data-reveal><DotGrid className="section-dot-grid"/><div className="install-copy"><p className="section-kicker">Debian, Ubuntu &amp; derivatives · amd64</p><h2>Install nekoHub.<br/>See your fleet.</h2><p>Configure the official APT repository, then install nekoHub. These commands are for Debian, Ubuntu, and compatible derivatives running on amd64.</p><div className="install-links"><a href="https://awakyy1.github.io/nekohub" target="_blank" rel="noreferrer">APT repository <Arrow/></a><a href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Read the source <Arrow/></a></div></div><button className="command" onClick={copy} aria-label="Copy installation commands"><span className="prompt">$</span><code>{installCommands}</code><span className={copied?"copy copied":"copy"}>{copied?"Copied":"Copy"}</span></button></section>

      <StoryCarousel/>

      <section id="agent" className="agent-section dot-grid-section" data-reveal>
        <DotGrid className="section-dot-grid"/>
        <div className="agent-copy"><p className="section-kicker">nekoHub agent</p><h2>The Nekohub Agent</h2><p>It reads native system signals, keeps a short local history, and serves the TUI without root privileges. No permanent SSH polling loop, no heavy runtime.</p><a href="https://github.com/awakyy1/nekohub/tree/main/crates/nekohub-agent" target="_blank" rel="noreferrer">Explore the agent source <Arrow/></a></div>
        <div className="agent-panel">
          <div className="agent-panel-head"><span><i/> nekohub-agent.service</span><b>active (running)</b></div>
          <div className="agent-step"><small>01 · COLLECT</small><strong>/proc + /sys</strong><span>CPU · memory · disk · load · network</span></div>
          <div className="agent-pulse"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <div className="agent-step"><small>02 · SERVE</small><strong>/run/nekohub/agent.sock</strong><span>read-only · no root · 1 second samples</span></div>
          <div className="agent-step final"><small>03 · EXPORT</small><strong>127.0.0.1:9876/metrics</strong><span>Prometheus compatible · optional by design</span></div>
        </div>
      </section>

      <AdaptiveDemo/>

      <section className="newsletter dot-grid-section" data-reveal>
        <div className="newsletter-inner">
          <div className="newsletter-copy">
            <p className="section-kicker">NekoHub Updates</p>
            <h2>Stay close to<br/><em>what ships next.</em></h2>
            <p>Release notes, development updates and technical notes from the NekoHub project.</p>
          </div>

          <form
            action="https://buttondown.com/api/emails/embed-subscribe/beatriz2"
            method="post"
            className="newsletter-form"
          >
            <label htmlFor="newsletter-email">Email address</label>

            <div className="newsletter-field">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <input type="hidden" name="embed" value="1" />
              <button type="submit">
                Subscribe <span>→</span>
              </button>
            </div>

            <p className="newsletter-note">
              Release updates only · unsubscribe anytime
            </p>
          </form>
        </div>
      </section>

      <section className="final-cta dot-grid-section" data-reveal><DotGrid className="section-dot-grid"/><Logo/><h2>Linux fleet management,<br/><em>designed for the terminal.</em></h2><div><a className="primary" href="#install">Install nekoHub <span>↘</span></a><a className="secondary" href="https://github.com/awakyy1/nekohub" target="_blank" rel="noreferrer">Star on GitHub <Arrow/></a></div></section>
    </main>
    <footer><DotField className="footer-dots"/><Logo/><div><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="https://awakyy1.github.io/nekohub">APT</a><a href="#top">Back to top ↑</a></div></footer>
  </div>;
}
