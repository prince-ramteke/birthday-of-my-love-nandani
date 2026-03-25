/* ============================================================
   BIRTHDAY WEBSITE — script.js
   GSAP + ScrollTrigger + Swiper + canvas-confetti + custom FX
   ============================================================ */

'use strict';

// ── Register GSAP plugins ───────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════════════
//  1. LOADING SCREEN
// ════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  // Wait for progress bar animation (~1.8s) then hide
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    initHeroAnimation();
    startParticles();
    startFloatingHearts();
  }, 2200);
});

// ════════════════════════════════════════════════════════
//  2. HERO ENTRANCE ANIMATION
// ════════════════════════════════════════════════════════
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-sub',     { opacity: 1, y: 0, duration: 0.9, delay: 0.1 })
    .to('.hero-title',   { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
    .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero-hearts',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('#open-surprise-btn', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

  // Subtle parallax on orbs with scroll
  gsap.to('.orb-1', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  gsap.to('.orb-2', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.orb-3', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });
}

// ════════════════════════════════════════════════════════
//  3. SECTION SCROLL ANIMATIONS  (GSAP + ScrollTrigger)
// ════════════════════════════════════════════════════════
document.querySelectorAll('.gsap-slide-up').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    }
  });
});

document.querySelectorAll('.gsap-fade').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });
});

// ── Timeline items — staggered alternating ──────────────
document.querySelectorAll('.gsap-timeline-item').forEach((item, i) => {
  const side = item.dataset.side;
  const fromX = side === 'left' ? -40 : 40;
  gsap.to(item, {
    opacity: 1,
    y: 0,
    x: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    delay: i * 0.05,
  });
  gsap.set(item, { x: fromX });
});

// ── Wish cards — staggered grid ─────────────────────────
gsap.utils.toArray('.gsap-wish-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'back.out(1.4)',
    delay: i * 0.08,
    scrollTrigger: {
      trigger: card,
      start: 'top 88%',
      toggleActions: 'play none none none',
    }
  });
});

// ── Finale bounce ───────────────────────────────────────
gsap.from('.gsap-finale-bounce', {
  scale: 0.4,
  opacity: 0,
  duration: 1,
  ease: 'elastic.out(1, 0.5)',
  scrollTrigger: {
    trigger: '#finale',
    start: 'top 75%',
    toggleActions: 'play none none none',
  }
});

// ════════════════════════════════════════════════════════
//  4. SWIPER — PHOTO GALLERY
// ════════════════════════════════════════════════════════
const gallerySwiper = new Swiper('#gallery-swiper', {
  slidesPerView: 1.2,
  centeredSlides: true,
  spaceBetween: 16,
  loop: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    400: { slidesPerView: 1.4 },
    640: { slidesPerView: 2.2 },
  },
  effect: 'coverflow',
  coverflowEffect: {
    rotate: 30,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
});

// ── Lightbox ────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose= document.getElementById('lightbox-close');

document.querySelectorAll('.photo-card[data-src]').forEach(card => {
  card.addEventListener('click', () => {
    lightboxImg.src = card.dataset.src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ════════════════════════════════════════════════════════
//  5. SURPRISE BOX — TAP TO REVEAL
// ════════════════════════════════════════════════════════
const surpriseBox    = document.getElementById('surprise-box');
const surpriseLid    = document.getElementById('surprise-lid');
const surpriseReveal = document.getElementById('surprise-reveal');
let surpriseOpened   = false;

if (surpriseBox) {
  surpriseBox.addEventListener('click', openSurprise);
  surpriseBox.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openSurprise(); });
}

function openSurprise() {
  if (surpriseOpened) return;
  surpriseOpened = true;

  // Animate lid flying open
  gsap.to(surpriseLid, {
    rotateX: -130,
    y: -60,
    opacity: 0,
    duration: 0.7,
    ease: 'back.in(1.2)',
    onComplete: () => {
      surpriseBox.style.display = 'none';
      surpriseReveal.classList.add('visible');
      surpriseReveal.setAttribute('aria-hidden', 'false');
      // Reveal animation
      gsap.from(surpriseReveal, { opacity: 0, scale: 0.8, duration: 0.6, ease: 'back.out(1.5)' });
    }
  });

  // CONFETTI BURST
  launchConfetti();
}

// ════════════════════════════════════════════════════════
//  6. LAST SURPRISE BUTTON — FINALE
// ════════════════════════════════════════════════════════
const lastSurpriseBtn  = document.getElementById('last-surprise-btn');
const finalMessage     = document.getElementById('final-message');
let finalOpened = false;

if (lastSurpriseBtn) {
  lastSurpriseBtn.addEventListener('click', () => {
    if (!finalOpened) {
      finalOpened = true;
      finalMessage.classList.add('visible');
      finalMessage.setAttribute('aria-hidden', 'false');
      lastSurpriseBtn.textContent = '💖 Happy Birthday My Love! 💖';
      lastSurpriseBtn.disabled = true;
      // Grand confetti
      launchGrandConfetti();
      startFireworks();
    }
  });
}

// ════════════════════════════════════════════════════════
//  7. CONFETTI HELPERS
// ════════════════════════════════════════════════════════
function launchConfetti() {
  const count = 180;
  const defaults = { origin: { y: 0.6 }, zIndex: 9999 };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f9a8d4','#c4b5fd','#fbbf24'] });
  fire(0.2,  { spread: 60,                    colors: ['#ec4899','#a78bfa','#fbbf24'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#fb7185','#f9a8d4','#c4b5fd'] });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#fbbf24','#f9a8d4'] });
  fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#ec4899','#7c3aed'] });
}

function launchGrandConfetti() {
  const duration  = 4 * 1000;
  const animEnd   = Date.now() + duration;
  const defaults  = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 };

  const colors = ['#f9a8d4','#c4b5fd','#fbbf24','#ec4899','#a78bfa','#fb7185','#fce7f3'];

  const interval = setInterval(() => {
    const timeLeft = animEnd - Date.now();
    if (timeLeft <= 0) { clearInterval(interval); return; }
    const count = 60 * (timeLeft / duration);
    confetti({ ...defaults, particleCount: count, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors });
    confetti({ ...defaults, particleCount: count, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors });
  }, 220);
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ════════════════════════════════════════════════════════
//  8. FIREWORKS — Canvas (finale section)
// ════════════════════════════════════════════════════════
let fireworksAnimFrame;
let fireworksActive = false;

function startFireworks() {
  if (fireworksActive) return;
  fireworksActive = true;

  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');
  const section= document.getElementById('finale');

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(section);

  const particles = [];
  const COLORS = ['#f9a8d4','#c4b5fd','#fbbf24','#ec4899','#fb7185','#ffffff','#a78bfa'];

  function createBurst(x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < 55; i++) {
      const angle = (i / 55) * Math.PI * 2;
      const speed = randomInRange(1.5, 5);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        radius: randomInRange(1.5, 3.5),
      });
    }
  }

  // Auto-launch bursts
  let burstCount = 0;
  const burstInterval = setInterval(() => {
    if (!fireworksActive || burstCount > 20) { clearInterval(burstInterval); return; }
    createBurst(randomInRange(0.15, 0.85) * canvas.width, randomInRange(0.15, 0.6) * canvas.height);
    burstCount++;
  }, 400);

  function draw() {
    ctx.fillStyle = 'rgba(13, 0, 32, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.04; // gravity
      p.alpha -= 0.016;
      p.vx *= 0.98;
      p.vy *= 0.98;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    fireworksAnimFrame = requestAnimationFrame(draw);
  }
  draw();

  // Stop after 8 seconds
  setTimeout(() => {
    fireworksActive = false;
    cancelAnimationFrame(fireworksAnimFrame);
    clearInterval(burstInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 8000);
}

// ════════════════════════════════════════════════════════
//  9. BACKGROUND PARTICLES CANVAS
// ════════════════════════════════════════════════════════
function startParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  const EMOJIS = ['✨','💫','🌸','💕','⭐','🌟'];
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function makeParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      size:  randomInRange(10, 18),
      speedY: randomInRange(0.3, 0.8),
      speedX: randomInRange(-0.2, 0.2),
      alpha:  randomInRange(0.2, 0.6),
      emoji:  EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
  }

  for (let i = 0; i < 30; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ════════════════════════════════════════════════════════
//  10. FLOATING HEARTS DOM LAYER
// ════════════════════════════════════════════════════════
function startFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const HEARTS = ['💕','💖','💗','🌸','💓','💝'];
  let count = 0;

  function spawnHeart() {
    if (count >= 18) return;
    const heart = document.createElement('span');
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const size  = randomInRange(14, 26);
    const left  = Math.random() * 100;
    const delay = Math.random() * 2;
    const dur   = randomInRange(6, 12);

    heart.style.cssText = `
      position: absolute;
      font-size: ${size}px;
      left: ${left}vw;
      bottom: -40px;
      animation: heartRise ${dur}s ${delay}s linear infinite;
      opacity: 0;
      pointer-events: none;
    `;
    container.appendChild(heart);
    count++;
  }

  // Inject keyframe if not already present
  if (!document.getElementById('heart-rise-style')) {
    const style = document.createElement('style');
    style.id = 'heart-rise-style';
    style.textContent = `
      @keyframes heartRise {
        0%   { transform: translateY(0)     rotate(0deg);    opacity: 0; }
        10%  { opacity: 0.5; }
        90%  { opacity: 0.3; }
        100% { transform: translateY(-105vh) rotate(20deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  for (let i = 0; i < 14; i++) spawnHeart();
}

// ════════════════════════════════════════════════════════
//  11. TAP-TO-SPAWN HEARTS ON MOBILE
// ════════════════════════════════════════════════════════
const tapContainer = document.getElementById('tap-hearts-container');
const TAP_EMOJIS   = ['💖','💕','💗','🌸','✨','💫'];

document.addEventListener('touchstart', handleTap, { passive: true });
document.addEventListener('click', handleTap);

function handleTap(e) {
  if (e.type === 'click' && e.pointerType === '') return; // skip keyboard
  const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  spawnTapHeart(x, y);
}

function spawnTapHeart(x, y) {
  const heart  = document.createElement('span');
  heart.classList.add('tap-heart');
  heart.textContent = TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)];

  const offsetX = randomInRange(-20, 20);
  heart.style.left = `${x + offsetX}px`;
  heart.style.top  = `${y - 10}px`;
  tapContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 1300);
}

// ════════════════════════════════════════════════════════
//  12. OPEN SURPRISE BUTTON — SMOOTH SCROLL
// ════════════════════════════════════════════════════════
document.getElementById('open-surprise-btn')?.addEventListener('click', () => {
  launchConfetti();
});

// ════════════════════════════════════════════════════════
//  13. TIMELINE GLOWING LINE — animate on scroll reveal
// ════════════════════════════════════════════════════════
gsap.from('.timeline-line', {
  scaleY: 0,
  transformOrigin: 'top center',
  duration: 2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#timeline',
    start: 'top 70%',
    toggleActions: 'play none none none',
  }
});

// ════════════════════════════════════════════════════════
//  14. INTRO — Letter typing / fade reveal
// ════════════════════════════════════════════════════════
// Intro card and text use gsap-slide-up class handled above.
// Additional stagger for intro paragraphs:
gsap.utils.toArray('.intro-text').forEach((p, i) => {
  gsap.from(p, {
    opacity: 0,
    y: 16,
    duration: 0.8,
    delay: i * 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: p,
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });
});

// ════════════════════════════════════════════════════════
//  15. HERO "Open Your Surprise" — button pulse glow anim
// ════════════════════════════════════════════════════════
gsap.to('#open-surprise-btn', {
  boxShadow: '0 4px 40px rgba(236,72,153,0.9), 0 0 0 10px rgba(236,72,153,0)',
  duration: 1.2,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
  delay: 3,
});

// ════════════════════════════════════════════════════════
//  16. WISH CARDS — hover glow effect via JS for touch
// ════════════════════════════════════════════════════════
document.querySelectorAll('.wish-card').forEach(card => {
  card.addEventListener('touchstart', () => {
    card.style.boxShadow = '0 0 30px rgba(249,168,212,0.45)';
    card.style.transform = 'translateY(-4px) scale(1.02)';
  }, { passive: true });
  card.addEventListener('touchend', () => {
    card.style.boxShadow = '';
    card.style.transform = '';
  });
});

// ════════════════════════════════════════════════════════
//  17. SECTION ENTER — trigger confetti snippets
// ════════════════════════════════════════════════════════
ScrollTrigger.create({
  trigger: '#finale',
  start: 'top 60%',
  once: true,
  onEnter: () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f9a8d4','#c4b5fd','#fbbf24'],
      zIndex: 9999,
    });
  }
});

// ════════════════════════════════════════════════════════
//  DONE — Log for debugging
// ════════════════════════════════════════════════════════
console.log('🎂 Birthday website loaded! Happy Birthday! 💖');
