import { memo, useEffect, useRef } from "react";

const DotField = memo(function DotField({ className = "", spacing = 18, radius = 1.2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const ctx = canvas.getContext("2d", { alpha: true });
    const pointer = { x: -999, y: -999, tx: -999, ty: -999 };
    let dots = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) dots.push({ x, y });
      }
    };
    const move = event => {
      const rect = container.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
    };
    const leave = () => { pointer.tx = -999; pointer.ty = -999; };
    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * .1;
      pointer.y += (pointer.ty - pointer.y) * .1;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(125,162,255,.72)");
      gradient.addColorStop(1, "rgba(115,239,203,.45)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 150);
        const push = influence * influence * 15;
        const angle = Math.atan2(dy, dx);
        const x = dot.x + Math.cos(angle) * push;
        const y = dot.y + Math.sin(angle) * push;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius * (1 + influence * .8), 0, Math.PI * 2);
      }
      ctx.fill();
      frame = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);
    resize();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
    else frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", leave);
    };
  }, [radius, spacing]);

  return <canvas ref={ref} className={`dot-field ${className}`.trim()} aria-hidden="true" />;
});

export default DotField;
