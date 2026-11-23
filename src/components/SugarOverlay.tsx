import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dirX: number;
  spreadK: number;
  swayPhase: number;
  radius: number;
  alpha: number;
  life: number;
  age: number;
};

const SIEVE_X = 851;
const SIEVE_Y = 400;
const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const EMISSION_DURATION = 8;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function positionFraction(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith("%")) return Number.parseFloat(normalized) / 100;
  if (normalized === "left" || normalized === "top") return 0;
  if (normalized === "right" || normalized === "bottom") return 1;
  return 0.5;
}

export default function SugarOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const video = document.querySelector<HTMLVideoElement>("[data-sieve-video]");
    const debug = new URLSearchParams(window.location.search).get("debug") === "1";
    if (!canvas || !context || !video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let lastFrame = 0;
    let lastLog = 0;
    let emittedTotal = 0;
    let emissionStartedAt: number | null = null;
    let emissionStopped = false;
    let particles: Particle[] = [];
    let origin = { x: 0, y: 0 };
    let isMobile = window.matchMedia("(max-width: 767px)").matches;
    let disposed = false;

    const particleLimit = () => (isMobile ? 700 : 1200);
    const emissionRate = () => (isMobile ? 50 : 90);

    const calculateOrigin = () => {
      const rect = video.getBoundingClientRect();
      const style = window.getComputedStyle(video);
      const scale = style.objectFit === "cover"
        ? Math.max(rect.width / SOURCE_WIDTH, rect.height / SOURCE_HEIGHT)
        : Math.min(rect.width / SOURCE_WIDTH, rect.height / SOURCE_HEIGHT);
      const renderedWidth = SOURCE_WIDTH * scale;
      const renderedHeight = SOURCE_HEIGHT * scale;
      const positions = style.objectPosition.split(/\s+/);
      const xFraction = positionFraction(positions[0] ?? "50%");
      const yFraction = positionFraction(positions[1] ?? positions[0] ?? "50%");
      const offsetX = (rect.width - renderedWidth) * xFraction;
      const offsetY = (rect.height - renderedHeight) * yFraction;
      origin = {
        x: rect.left + offsetX + SIEVE_X * scale,
        y: rect.top + offsetY + SIEVE_Y * scale,
      };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = window.matchMedia("(max-width: 767px)").matches;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      calculateOrigin();
    };

    const createParticle = (): Particle => ({
      x: origin.x + random(-2, 2),
      y: origin.y + random(-2, 2),
      vx: 0,
      vy: random(30, 60),
      dirX: random(-1, 1),
      spreadK: random(28, 45),
      swayPhase: random(0, Math.PI * 2),
      radius: isMobile ? random(1, 2.4) : random(1.2, 3),
      alpha: random(0.7, 1),
      life: random(3.5, 4.5),
      age: 0,
    });

    const drawDebugMarker = () => {
      if (!debug) return;
      context.save();
      context.globalAlpha = 1;
      context.beginPath();
      context.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
      context.fillStyle = "#ff0000";
      context.fill();
      context.font = "12px monospace";
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = "#ff0000";
      context.fillText(`X: ${origin.x.toFixed(1)}px  Y: ${origin.y.toFixed(1)}px`, origin.x + 9, origin.y);
      context.restore();
    };

    const tryPlay = () => {
      if (video.paused && !video.ended) {
        void video.play().catch(() => undefined);
      }
    };

    const resumeOnInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", resumeOnInteraction);
      window.removeEventListener("touchstart", resumeOnInteraction);
      window.removeEventListener("keydown", resumeOnInteraction);
      window.removeEventListener("wheel", resumeOnInteraction);
      window.removeEventListener("scroll", resumeOnInteraction);
    };

    const draw = (time: number) => {
      frame = 0;
      if (disposed || document.hidden) return;
      const deltaMs = lastFrame ? Math.min(time - lastFrame, 50) : 16.67;
      const deltaSeconds = deltaMs / 1000;
      const deltaFrames = deltaMs / (1000 / 60);
      const airResistance = Math.pow(0.985, deltaFrames);
      lastFrame = time;
      calculateOrigin();
      context.clearRect(0, 0, width, height);

      const playing = !video.paused && !video.ended;
      if (playing) {
        if (emissionStartedAt === null) emissionStartedAt = video.currentTime;
        const elapsedVideo = video.currentTime - emissionStartedAt;
        if (elapsedVideo < EMISSION_DURATION && !emissionStopped) {
          const requested = emissionRate() * (deltaMs / 1000);
          const count = Math.floor(requested) + (Math.random() < requested % 1 ? 1 : 0);
          for (let i = 0; i < count && particles.length < particleLimit() && emittedTotal < particleLimit(); i += 1) {
            particles.push(createParticle());
            emittedTotal += 1;
          }
        } else {
          emissionStopped = true;
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.age += deltaSeconds;

        // A abertura horizontal cresce com a idade individual de cada partícula.
        particle.vx = particle.dirX * particle.spreadK * particle.age;
        particle.vx *= airResistance;
        particle.vy += 40 * deltaSeconds;

        // Após 2s, o pó perde sustentação vertical e permanece mais tempo em nuvem.
        if (particle.age > 2) {
          particle.vy *= Math.pow(0.45, deltaSeconds);
        }
        particle.vy *= airResistance;

        particle.x += particle.vx * deltaSeconds;
        particle.y += particle.vy * deltaSeconds;

        const fade = Math.max(0, 1 - particle.age / particle.life);
        const shimmer = 0.92 + Math.sin(particle.age * 5 + particle.swayPhase) * 0.08;
        const sway = Math.sin(particle.age * 3.2 + particle.swayPhase) * 3;
        context.globalAlpha = particle.alpha * fade * shimmer;
        context.beginPath();
        context.arc(particle.x + sway, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "#F5F3EE";
        context.fill();
        if (particle.age >= particle.life) particles.splice(i, 1);
      }
      context.globalAlpha = 1;
      drawDebugMarker();

      if (time - lastLog >= 2000) {
        lastLog = time;
        console.log("[hero-video]", {
          currentTime: Number(video.currentTime.toFixed(2)),
          activeParticles: particles.length,
          emittedParticles: emittedTotal,
          playing,
        });
        if (!playing) console.log("hero-video: não está tocando");
      }
      frame = window.requestAnimationFrame(draw);
    };

    const startFrameLoop = () => {
      if (!frame && !disposed && !document.hidden) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", resumeOnInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", resumeOnInteraction, { once: true, passive: true });
    window.addEventListener("keydown", resumeOnInteraction, { once: true });
    window.addEventListener("wheel", resumeOnInteraction, { once: true, passive: true });
    window.addEventListener("scroll", resumeOnInteraction, { once: true, passive: true });
    video.addEventListener("play", startFrameLoop);
    video.addEventListener("loadedmetadata", calculateOrigin);
    document.addEventListener("visibilitychange", startFrameLoop);
    tryPlay();
    startFrameLoop();

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", resumeOnInteraction);
      window.removeEventListener("touchstart", resumeOnInteraction);
      window.removeEventListener("keydown", resumeOnInteraction);
      window.removeEventListener("wheel", resumeOnInteraction);
      window.removeEventListener("scroll", resumeOnInteraction);
      video.removeEventListener("play", startFrameLoop);
      video.removeEventListener("loadedmetadata", calculateOrigin);
      document.removeEventListener("visibilitychange", startFrameLoop);
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
