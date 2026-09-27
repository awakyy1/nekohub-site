import { memo, useEffect, useRef } from "react";

const toRgb = hex => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16));
};

const DotGrid = memo(function DotGrid({
  dotSize = 2.4,
  gap = 24,
  baseColor = "#35405d",
  activeColor = "#a888ff",
  proximity = 135,
  className = ""
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const base = toRgb(baseColor);
    const active = toRgb(activeColor);
    const pointer = { x: -9999, y: -9999 };
    let dots = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const build = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cell = dotSize + gap;
      const cols = Math.ceil(width / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      const offsetX = (width - (cols - 1) * cell) / 2;
      const offsetY = (height - (rows - 1) * cell) / 2;
      dots = [];
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        const x = offsetX + col * cell;
        const y = offsetY + row * cell;
        dots.push({ x, y, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
    };

    const move = event => {
      const rect = wrapper.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const leave = () => { pointer.x = -9999; pointer.y = -9999; };
    const shock = event => {
      const rect = wrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      for (const dot of dots) {
        const dx = dot.x - x;
        const dy = dot.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance < 180) {
          const force = (1 - distance / 180) * 4;
          dot.vx += (dx / Math.max(distance, 1)) * force;
          dot.vy += (dy / Math.max(distance, 1)) * force;
        }
      }
    };

    const draw = () => {
      if (!visible) { frame = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        dot.vx += -dot.ox * .045;
        dot.vy += -dot.oy * .045;
        dot.vx *= .9;
        dot.vy *= .9;
        dot.ox += dot.vx;
        dot.oy += dot.vy;
        const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
        const amount = Math.max(0, 1 - distance / proximity);
        const color = base.map((channel, index) => Math.round(channel + (active[index] - channel) * amount));
        ctx.beginPath();
        ctx.fillStyle = `rgb(${color.join(",")})`;
        ctx.arc(dot.x + dot.ox, dot.y + dot.oy, dotSize / 2 * (1 + amount * .8), 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(build);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    ro.observe(wrapper);
    io.observe(wrapper);
    build();
    if (reducedMotion) draw();
    else {
      wrapper.addEventListener("pointermove", move);
      wrapper.addEventListener("pointerleave", leave);
      wrapper.addEventListener("click", shock);
      frame = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      wrapper.removeEventListener("pointermove", move);
      wrapper.removeEventListener("pointerleave", leave);
      wrapper.removeEventListener("click", shock);
    };
  }, [activeColor, baseColor, dotSize, gap, proximity]);

  return <div ref={wrapperRef} className={`dot-grid ${className}`.trim()} aria-hidden="true"><canvas ref={canvasRef}/></div>;
});

export default DotGrid;
