import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
  frequency: number;
  amplitude: number;
  drift: number;
};

const TAU = Math.PI * 2;
const FRAME_MS = 1000 / 60;
type BurstParticle = Particle & { remaining: number };

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticle(width: number, height: number, layer: number, burst = false): Particle {
  const ranges = [
    { radius: [0.6, 1.2], alpha: [0.25, 0.45], speed: [0.25, 0.5] },
    { radius: [1.2, 2.2], alpha: [0.4, 0.7], speed: [0.5, 0.9] },
    { radius: [2.2, 3.4], alpha: [0.5, 0.8], speed: [0.9, 1.5] },
  ];
  const range = ranges[layer];
  return {
    x: burst ? random(width * 0.25, width * 0.75) : random(0, width),
    y: burst ? random(0, height * 0.15) : random(-height, height),
    radius: random(range.radius[0], range.radius[1]),
    alpha: random(range.alpha[0], range.alpha[1]),
    speed: random(range.speed[0], range.speed[1]) * (burst ? random(1.25, 1.7) : 1),
    phase: random(0, TAU),
    frequency: random(0.008, 0.025),
    amplitude: random(0.2, 0.6) * (burst ? 1.5 : 1),
    drift: burst ? random(-0.9, 0.9) : random(-0.12, 0.12),
  };
}

export default function SugarOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let burstParticles: BurstParticle[] = [];
    let animationFrame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let scrollYCurrent = window.scrollY;
    let scrollYPreviousFrame = window.scrollY;
    let scrollMultiplier = 1;
    let horizontalWind = 0;
    let sprite: HTMLCanvasElement;

    const createSprite = () => {
      sprite = document.createElement("canvas");
      sprite.width = 64;
      sprite.height = 64;
      const spriteContext = sprite.getContext("2d");
      if (!spriteContext) return;
      const gradient = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(245,243,238,1)");
      gradient.addColorStop(1, "rgba(245,243,238,0)");
      spriteContext.fillStyle = gradient;
      spriteContext.fillRect(0, 0, 64, 64);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.height = "100dvh";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const total = window.innerWidth > 768 ? 140 : 70;
      const distant = Math.round(total * 0.6);
      const medium = Math.round(total * 0.3);
      const near = total - distant - medium;
      particles = [
        ...Array.from({ length: distant }, () => createParticle(width, height, 0)),
        ...Array.from({ length: medium }, () => createParticle(width, height, 1)),
        ...Array.from({ length: near }, () => createParticle(width, height, 2)),
      ];
    };

    const particleLimit = () => (window.innerWidth > 768 ? 220 : 110);

    const emitBurst = () => {
      for (let i = 0; i < 90 && particles.length < particleLimit(); i += 1) {
        const layer = i % 10 < 6 ? 0 : i % 10 < 9 ? 1 : 2;
        particles.push(createParticle(width, height, layer, true));
      }
    };

    const emitScrollParticles = () => {
      if (particles.length >= particleLimit()) return;
      for (let i = 0; i < 2 && particles.length < particleLimit(); i += 1) {
        const layerRoll = Math.random();
        const layer = layerRoll < 0.6 ? 0 : layerRoll < 0.9 ? 1 : 2;
        const particle = createParticle(width, height, layer);
        particle.y = i === 0 ? random(-8, -2) : random(height + 2, height + 8);
        particle.x = random(0, width);
        particles.push(particle);
      }
    };


    const handleSugarBurst = (event: Event) => {
      const detail = (event as CustomEvent<{ x?: number; y?: number; count?: number }>).detail;
      if (!detail || !Number.isFinite(detail.x) || !Number.isFinite(detail.y)) return;
      const count = Math.max(0, Math.min(80, Math.floor(detail.count ?? 18)));
      for (let i = 0; i < count; i += 1) {
        const roll = Math.random();
        const layer = roll < 0.6 ? 0 : roll < 0.9 ? 1 : 2;
        const particle = createParticle(width, height, layer);
        particle.x = Math.max(-8, Math.min(width + 8, detail.x! + random(-40, 40)));
        particle.y = Math.max(-8, Math.min(height + 8, detail.y! + random(-40, 40)));
        particle.alpha = random(0.6, 0.9);
        particle.speed = random(0.35, 0.7);
        particle.drift = random(-0.35, 0.35);
        particle.amplitude = random(0.15, 0.45);
        burstParticles.push({ ...particle, remaining: random(40, 120) });
      }
    };

    const draw = (time: number) => {
      if (document.hidden) {
        animationFrame = 0;
        previousTime = 0;
        return;
      }
      const delta = previousTime ? Math.min(time - previousTime, 50) / FRAME_MS : 1;
      previousTime = time;
      elapsed += delta;

      const scrollDelta = Math.abs(scrollYCurrent - scrollYPreviousFrame);
      const signedScrollDelta = scrollYCurrent - scrollYPreviousFrame;
      scrollYPreviousFrame = scrollYCurrent;
      const targetMultiplier = 1 + Math.min(scrollDelta * 0.12, 2.6);
      scrollMultiplier += (targetMultiplier - scrollMultiplier) * 0.12;

      const targetWind = Math.sign(signedScrollDelta) * Math.min(scrollDelta * 0.01, 0.8);
      horizontalWind += (targetWind - horizontalWind) * 0.12;

      if (scrollMultiplier > 2) emitScrollParticles();

      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const verticalSpeed = Math.min(particle.speed * scrollMultiplier, 6);
        particle.y += verticalSpeed * delta;
        particle.x += (Math.sin(elapsed * particle.frequency + particle.phase) * particle.amplitude + particle.drift + horizontalWind) * delta;
        if (particle.y - particle.radius > height) {
          particle.y = random(-40, -5);
          particle.x = random(0, width);
        }
        if (particle.x < -10) particle.x = width + 5;
        if (particle.x > width + 10) particle.x = -5;

        const alpha = particle.alpha * (0.75 + 0.25 * Math.sin(elapsed * 2 + particle.phase));
        const diameter = particle.radius * 2;
        context.globalAlpha = Math.max(0, alpha);
        context.drawImage(sprite, particle.x - particle.radius, particle.y - particle.radius, diameter, diameter);
      }
      for (let i = burstParticles.length - 1; i >= 0; i -= 1) {
        const particle = burstParticles[i];
        const step = Math.min(particle.speed * delta, particle.remaining);
        particle.y += step;
        particle.remaining -= step;
        particle.x += (Math.sin(elapsed * particle.frequency + particle.phase) * particle.amplitude + particle.drift) * delta;
        context.globalAlpha = particle.alpha * Math.min(1, particle.remaining / 18);
        const diameter = particle.radius * 2;
        context.drawImage(sprite, particle.x - particle.radius, particle.y - particle.radius, diameter, diameter);
        if (particle.remaining <= 0) burstParticles.splice(i, 1);
      }
      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    createSprite();
    resize();
    emitBurst();

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        previousTime = 0;
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handleScroll = () => {
      scrollYCurrent = window.scrollY;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("sugar:burst", handleSugarBurst as EventListener);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("sugar:burst", handleSugarBurst as EventListener);
      burstParticles = [];
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 40,
      }}
    />
  );
}
