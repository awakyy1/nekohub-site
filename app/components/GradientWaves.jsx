import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

const vertex = `#version 300 es
in vec2 position;
void main(){ gl_Position=vec4(position,0.0,1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uOpacity;
uniform vec2 uMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

float hash21(vec2 p){
  vec3 p3=fract(vec3(p.xyx)*.1031);
  p3+=dot(p3,p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}

float plasma(vec3 r,vec2 freq,vec4 tc){
  float mx=r.x+tc.x;
  mx+=31.0*sin((r.y+mx)/20.0+tc.y);
  float my=r.y-tc.z;
  my+=18.0*cos(r.x/23.0+tc.w);
  return r.z-(sin(mx*freq.x)*2.5+sin(my*freq.y)*2.5+5.5);
}

float raymarch(vec3 pos,vec3 dir,vec2 freq,vec4 tc){
  float dist=0.0;
  for(int i=0;i<82;i++){
    float dscene=plasma(pos+dist*dir,freq,tc);
    if(abs(dscene)<.1) break;
    dist+=.9*dscene;
    if(!(abs(dist)<20000.0)) return 20000.0;
  }
  return dist;
}

void main(){
  float T=iTime*.25;
  vec2 freq=vec2(.084,.18);
  vec4 tc=vec4(T/.130,T/.810,T/.200,T/.710);
  float c,s;
  float vfov=3.14159/2.3;
  vec3 cam=vec3(0.0,0.0,30.0);
  vec2 uv=gl_FragCoord.xy/iResolution.xy-.5;
  uv.x*=iResolution.x/iResolution.y;
  uv.y*=-1.0;
  vec3 dir=vec3(0.0,0.0,-1.0);
  float ulen=length(uv);
  float xrot=vfov*ulen;
  c=cos(xrot);s=sin(xrot);
  dir=mat3(1.,0.,0.,0.,c,-s,0.,s,c)*dir;
  vec2 nuv=ulen>1e-5?uv/ulen:vec2(1.,0.);
  c=nuv.x;s=nuv.y;
  dir=mat3(c,-s,0.,s,c,0.,0.,0.,1.)*dir;
  c=cos(1.08);s=sin(1.08);
  dir=mat3(c,0.,s,0.,1.,0.,-s,0.,c)*dir;
  float yaw=(uMouse.x-.5)*.13;
  float pitch=(uMouse.y-.5)*.13;
  c=cos(yaw);s=sin(yaw);
  dir=mat3(c,0.,s,0.,1.,0.,-s,0.,c)*dir;
  c=cos(pitch);s=sin(pitch);
  dir=mat3(1.,0.,0.,0.,c,-s,0.,s,c)*dir;
  float dist=raymarch(cam,dir,freq,tc);
  vec3 pos=cam+dist*dir;
  float fog=clamp(15.0/max(dist,.001),0.,1.);
  vec3 body=mix(uWaveColor,uCrestColor,clamp(pos.z*.08+.5,0.,1.));
  vec3 col=mix(uHorizonColor,body,fog);
  float alpha=clamp(fog,0.,1.)*uOpacity;
  alpha+=(hash21(gl_FragCoord.xy+mod(iTime,64.)*11.)-.5)*.025;
  alpha=clamp(alpha,0.,1.);
  fragColor=vec4(col*alpha,alpha);
}`;

const rgb = value => {
  const hex = value.replace("#", "");
  return new Float32Array([0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255));
};

export default function GradientWaves({
  horizonColor = "#27105c",
  waveColor = "#7562ff",
  crestColor = "#b8fff0",
  opacity = 0.58,
  className = ""
}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    Object.assign(gl.canvas.style, { width: "100%", height: "100%", display: "block" });
    container.appendChild(gl.canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) },
      uOpacity: { value: opacity }, uMouse: { value: new Float32Array([.5, .5]) },
      uHorizonColor: { value: rgb(horizonColor) }, uWaveColor: { value: rgb(waveColor) }, uCrestColor: { value: rgb(crestColor) }
    }});
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      program.uniforms.iResolution.value.set([gl.drawingBufferWidth, gl.drawingBufferHeight]);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const target = [.5, .5];
    const current = [.5, .5];
    const move = event => {
      const rect = container.getBoundingClientRect();
      target[0] = (event.clientX - rect.left) / rect.width;
      target[1] = 1 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => { target[0] = .5; target[1] = .5; };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;
    const draw = now => {
      program.uniforms.iTime.value = reduce ? 0 : (now - started) / 1000;
      current[0] += (target[0] - current[0]) * .045;
      current[1] += (target[1] - current[1]) * .045;
      program.uniforms.uMouse.value.set(current);
      renderer.render({ scene: mesh });
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", leave);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [crestColor, horizonColor, opacity, waveColor]);

  return <div ref={ref} className={`gradient-waves ${className}`.trim()} aria-hidden="true" />;
}
