import { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  size: number;
  depth: number;
}

function buildParticles(width: number, height: number): Particle[] {
  const count = Math.min(130, Math.max(60, Math.floor((width * height) / 18000)));
  const particles: Particle[] = [];

  for (let i = 0; i < count; i += 1) {
    const baseX = Math.random() * width;
    const baseY = Math.random() * height;
    const depth = Math.random();

    particles.push({
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.55,
      size: 0.75 + Math.random() * 1.6,
      depth,
    });
  }

  return particles;
}

export default function HeroParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let particles: Particle[] = [];
    let animationFrameId = 0;
    let fieldOffsetX = 0;
    let fieldOffsetY = 0;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
      lastMoveAt: 0,
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(devicePixelRatio, devicePixelRatio);
      context.globalCompositeOperation = 'source-over';

      particles = buildParticles(width, height);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = clientX - bounds.left;
      pointer.y = clientY - bounds.top;
      pointer.active = true;
      pointer.lastMoveAt = performance.now();
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      updatePointer(touch.clientX, touch.clientY);
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const drawFrame = (now: number) => {
      const seconds = now * 0.001;
      context.clearRect(0, 0, width, height);

      if (pointer.active && now - pointer.lastMoveAt > 220) {
        pointer.active = false;
      }

      const targetOffsetX = pointer.active ? (pointer.x - width / 2) * 0.02 : 0;
      const targetOffsetY = pointer.active ? (pointer.y - height / 2) * 0.02 : 0;
      fieldOffsetX += (targetOffsetX - fieldOffsetX) * 0.07;
      fieldOffsetY += (targetOffsetY - fieldOffsetY) * 0.07;

      const repelRadius = 180;
      const repelRadiusSquared = repelRadius * repelRadius;

      for (const particle of particles) {
        const driftRadius = 8 + particle.depth * 18;
        const targetX = particle.baseX
          + Math.cos(seconds * particle.speed + particle.phase) * driftRadius
          + fieldOffsetX * (0.25 + particle.depth * 0.55);
        const targetY = particle.baseY
          + Math.sin(seconds * particle.speed * 0.9 + particle.phase) * driftRadius
          + fieldOffsetY * (0.25 + particle.depth * 0.55);

        particle.vx += (targetX - particle.x) * 0.015;
        particle.vy += (targetY - particle.y) * 0.015;

        if (!reducedMotion && pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < repelRadiusSquared) {
            const distance = Math.max(1, Math.sqrt(distanceSquared));
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            const force = ((repelRadius - distance) / repelRadius) * (0.72 + particle.depth * 1.1);

            particle.vx += normalizedDx * force;
            particle.vy += normalizedDy * force;
          }
        }

        particle.vx *= 0.92;
        particle.vy *= 0.92;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      const lineDistance = 125;
      const lineDistanceSquared = lineDistance * lineDistance;

      context.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const particleA = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const particleB = particles[j];
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared > lineDistanceSquared) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const depthMix = (particleA.depth + particleB.depth) * 0.5;
          const opacity = (1 - distance / lineDistance) * (0.08 + depthMix * 0.22);

          context.strokeStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
          context.beginPath();
          context.moveTo(particleA.x, particleA.y);
          context.lineTo(particleB.x, particleB.y);
          context.stroke();
        }
      }

      if (pointer.active) {
        const pointerGlow = context.createRadialGradient(
          pointer.x,
          pointer.y,
          8,
          pointer.x,
          pointer.y,
          140
        );
        pointerGlow.addColorStop(0, 'rgba(255,255,255,0.35)');
        pointerGlow.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = pointerGlow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 140, 0, Math.PI * 2);
        context.fill();
      }

      for (const particle of particles) {
        const radius = particle.size * (0.75 + particle.depth * 0.95);
        const opacity = 0.24 + particle.depth * 0.64;

        context.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    resize();
    animationFrameId = window.requestAnimationFrame(drawFrame);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-particle-field absolute inset-0 block h-full w-full pointer-events-none"
      aria-hidden
    />
  );
}
