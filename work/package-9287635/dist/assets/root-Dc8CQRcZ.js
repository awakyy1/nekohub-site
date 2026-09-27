import{u as y,a as f,b as x,c as S,r as i,_ as g,e as a,j as e,O as w,M as j,L as k,S as L}from"./components-C9gPxNpb.js";/**
 * @remix-run/react v2.17.5
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function M({getKey:t,...c}){let{isSpaMode:u}=y(),r=f(),m=x();S({getKey:t,storageKey:l});let d=i.useMemo(()=>{if(!t)return null;let s=t(r,m);return s!==r.key?s:null},[]);if(u)return null;let h=((s,p)=>{if(!window.history.state||!window.history.state.key){let n=Math.random().toString(32).slice(2);window.history.replaceState({key:n},"")}try{let o=JSON.parse(sessionStorage.getItem(s)||"{}")[p||window.history.state.key];typeof o=="number"&&window.scrollTo(0,o)}catch(n){console.error(n),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",g({},c,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${a(JSON.stringify(l))}, ${a(JSON.stringify(d))})`}}))}const I="/assets/styles-Ggc3G5iI.css",b=()=>[{rel:"stylesheet",href:I}],H=()=>[{title:"nekoHub — Linux fleet management, designed for the terminal"},{name:"description",content:"A fast, open source TUI for monitoring and managing Linux machines from one calm terminal workspace."}];function R({children:t}){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width,initial-scale=1"}),e.jsx(j,{}),e.jsx(k,{})]}),e.jsxs("body",{children:[t,e.jsx(M,{}),e.jsx(L,{})]})]})}function _(){return e.jsx(w,{})}export{R as Layout,_ as default,b as links,H as meta};
