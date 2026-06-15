import React, { useEffect, useRef } from "react";

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars: Array<{ x: number; y: number; r: number; a: number; z: number }> = [];
    const COUNT = 180;
    const R = 400;
    const ATTRACT_MULT = 3;
    let mouse = { x: null as number | null, y: null as number | null };
    let Rpx = R * dpr;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      Rpx = R * dpr;
    };

    const init = () => {
      stars.length = 0;
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x: rnd(0, w),
          y: rnd(0, h),
          r: rnd(0.4, 1.4) * dpr,
          a: rnd(0.35, 0.85),
          z: rnd(0.2, 1),
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const baseV = s.z * 0.12;
        s.y += baseV;
        if (s.y > h) s.y -= h;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < Rpx * Rpx) {
            const d = Math.sqrt(d2) || 1;
            const inf = 1 - d / Rpx;
            const ux = dx / d;
            const uy = dy / d;
            s.x += ux * baseV * 2 * ATTRACT_MULT * inf;
            s.y += uy * baseV * 2 * ATTRACT_MULT * inf;
          }
        }

        if (s.x < 0) s.x += w;
        if (s.x > w) s.x -= w;
        if (s.y < 0) s.y += h;
        if (s.y > h) s.y -= h;

        ctx.globalAlpha = s.a + Math.sin((s.x + s.y) * 0.0015) * 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (s.r > 1.2 * dpr) {
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 filter contrast-[105%] brightness-[102%]"
      aria-hidden="true"
    />
  );
};
