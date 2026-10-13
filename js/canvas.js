/**
 * UNIVERS42 - INTERACTIVE CYBER CONSTELLATION CANVAS
 * High-performance particle network with mobile optimization & touch-scroll pause
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? 22 : 52;
    const MAX_LINE_DIST = isMobile ? 90 : 130;
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = window.innerWidth <= 768;
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.42;
        this.vy = (Math.random() - 0.5) * 0.42;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.45 ? '#00f2fe' : '#6366f1';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let canvasVisible = true;
    document.addEventListener('visibilitychange', () => {
      canvasVisible = !document.hidden;
      if (canvasVisible) requestAnimationFrame(animateParticles);
    });

    // Touch-scroll pause: don't spend GPU cycles while the user is actively scrolling on mobile
    let isScrolling = false;
    let scrollDebounce = null;
    window.addEventListener('scroll', () => {
      if (isMobile) {
        isScrolling = true;
        if (scrollDebounce) clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
    }, { passive: true });

    let lastFrameTime = 0;
    const targetInterval = isMobile ? (1000 / 30) : (1000 / 45); // 30 FPS mobile / 45 FPS desktop

    function animateParticles(currentTime = 0) {
      if (!canvasVisible) return;
      requestAnimationFrame(animateParticles);

      if (isScrolling && isMobile) return; // Skip frame during touch scroll for 60/120fps smoothness

      if (currentTime - lastFrameTime < targetInterval) return;
      lastFrameTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < pLen; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_LINE_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / MAX_LINE_DIST)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animateParticles);
  });
})();
