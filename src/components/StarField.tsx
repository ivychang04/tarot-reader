import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
}

function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.3 + 0.1,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

/**
 * Animated star field background rendered via Canvas.
 * Creates a mystical night-sky atmosphere behind all screens.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = createStars(150, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function animate(time: number) {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * 0.001 * star.speed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.5 + 0.5 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${currentOpacity})`;
        ctx.fill();

        // Subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${currentOpacity * 0.1})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
