<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let ctx = null;
let raf = null;
let W = 0, H = 0;
let stars = [];
let shooters = [];
let nebulae = [];
let scrollY = 0;

// ─── NEBULA ───────────────────────────────────────────────────
function buildNebulae() {
  nebulae = [
    { x: 0.18, y: 0.22, rx: 320, ry: 140, angle: -0.3,  r: 130, g: 80,  b: 200, a: 0.045 },
    { x: 0.72, y: 0.55, rx: 260, ry: 110, angle:  0.5,  r: 80,  g: 60,  b: 180, a: 0.038 },
    { x: 0.50, y: 0.30, rx: 500, ry: 90,  angle:  0.15, r: 100, g: 70,  b: 210, a: 0.028 }, // milky band
    { x: 0.85, y: 0.15, rx: 180, ry: 80,  angle: -0.6,  r: 60,  g: 90,  b: 190, a: 0.032 },
  ];
}

function drawNebulae() {
  for (const n of nebulae) {
    ctx.save();
    ctx.translate(n.x * W, n.y * H);
    ctx.rotate(n.angle);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
    g.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${n.a})`);
    g.addColorStop(0.5, `rgba(${n.r},${n.g},${n.b},${n.a * 0.4})`);
    g.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);
    ctx.scale(1, n.ry / n.rx);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, n.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─── STAR ─────────────────────────────────────────────────────
const STAR_COUNT = 220;

// Milky way band: diagonal density zone
function inBand(x, y) {
  // diagonal band from top-left to bottom-right
  const norm = (x / W) - (y / H) * 0.6;
  return norm > 0.05 && norm < 0.55;
}

class Star {
  constructor(randomY = true) {
    this.reset(randomY);
  }

  reset(randomY = false) {
    // Cluster bias: 40% of stars spawned in the band
    if (Math.random() < 0.40) {
      // spawn inside band
      this.x = Math.random() * W;
      this.y = randomY ? Math.random() * H : -2;
      let tries = 0;
      while (!inBand(this.x, this.y) && tries++ < 20) {
        this.x = Math.random() * W;
      }
    } else {
      this.x = Math.random() * W;
      this.y = randomY ? Math.random() * H : -2;
    }

    const r = Math.random();
    if      (r < 0.68) { this.radius = 0.35 + Math.random() * 0.45; this.tier = 0; }
    else if (r < 0.90) { this.radius = 0.85 + Math.random() * 0.55; this.tier = 1; }
    else               { this.radius = 1.6  + Math.random() * 0.9;  this.tier = 2; }

    // Parallax: 3 depth layers
    const layer = Math.floor(Math.random() * 3);
    this.speed  = [0.02, 0.055, 0.12][layer];
    this.layer  = layer;

    this.phase       = Math.random() * Math.PI * 2;
    this.twinkleSpd  = 0.006 + Math.random() * 0.014;
    // Atmospheric color shift: white ↔ faint blue/purple
    this.colorPhase  = Math.random() * Math.PI * 2;
    this.colorSpd    = 0.003 + Math.random() * 0.006;

    const tint = Math.random();
    if      (tint < 0.12) { this.cr = 210; this.cg = 190; this.cb = 255; }
    else if (tint < 0.22) { this.cr = 190; this.cg = 210; this.cb = 255; }
    else                  { this.cr = 255; this.cg = 255; this.cb = 255; }

    this.baseOpacity = 0.30 + Math.random() * 0.60;

    // Only tier-2 stars get diffraction spikes
    this.hasSpikes = this.tier === 2 && Math.random() < 0.55;
    this.spikeAngle = Math.random() * Math.PI;
  }

  update() {
    this.y          += this.speed;
    this.phase      += this.twinkleSpd;
    this.colorPhase += this.colorSpd;
    if (this.y > H + 4) this.reset(false);
  }

  draw(c) {
    const twinkle  = Math.sin(this.phase) * 0.20;
    const opacity  = Math.max(0, Math.min(1, this.baseOpacity + twinkle));

    // Atmospheric color scintillation on bright stars
    const cs = Math.sin(this.colorPhase) * 0.5 + 0.5; // 0→1
    const r  = this.tier >= 1 ? Math.round(this.cr * (0.85 + cs * 0.15)) : this.cr;
    const g  = this.tier >= 1 ? Math.round(this.cg * (0.88 + cs * 0.12)) : this.cg;
    const b  = this.tier >= 1 ? Math.round(this.cb * (0.80 + cs * 0.20)) : this.cb;

    // Glow halo for medium + large
    if (this.tier >= 1) {
      const glowR = this.radius * (this.tier === 2 ? 5 : 3.5);
      const glow  = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
      glow.addColorStop(0,   `rgba(${r},${g},${b},${opacity * 0.55})`);
      glow.addColorStop(0.4, `rgba(${r},${g},${b},${opacity * 0.15})`);
      glow.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      c.beginPath();
      c.fillStyle = glow;
      c.arc(this.x, this.y, glowR, 0, Math.PI * 2);
      c.fill();
    }

    // Core dot
    c.beginPath();
    c.fillStyle = `rgba(${r},${g},${b},${opacity})`;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fill();

    // Diffraction spikes
    if (this.hasSpikes) {
      const spikeLen  = this.radius * 6 * opacity;
      const spikeAlpha = opacity * 0.55;
      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.spikeAngle);
      for (let s = 0; s < 2; s++) {
        const ang = s * Math.PI / 2;
        c.rotate(ang);
        const grad = c.createLinearGradient(-spikeLen, 0, spikeLen, 0);
        grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.45,`rgba(${r},${g},${b},${spikeAlpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${spikeAlpha * 1.3})`);
        grad.addColorStop(0.55,`rgba(${r},${g},${b},${spikeAlpha})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        c.strokeStyle = grad;
        c.lineWidth   = 0.7;
        c.beginPath();
        c.moveTo(-spikeLen, 0);
        c.lineTo( spikeLen, 0);
        c.stroke();
      }
      c.restore();
    }
  }
}

// ─── SHOOTING STAR ────────────────────────────────────────────
class Shooter {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * W * 0.8 + W * 0.1;
    this.y     = Math.random() * H * 0.4;
    this.angle = (Math.PI / 6) + Math.random() * (Math.PI / 8); // ~30–52°
    this.speed = 8 + Math.random() * 7;
    this.len   = 90 + Math.random() * 80;
    this.life  = 1;
    this.decay = 0.018 + Math.random() * 0.012;
    this.vx    = Math.cos(this.angle) * this.speed;
    this.vy    = Math.sin(this.angle) * this.speed;
  }

  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life -= this.decay;
  }

  draw(c) {
    if (this.life <= 0) return;
    const tailX = this.x - this.vx / this.speed * this.len * this.life;
    const tailY = this.y - this.vy / this.speed * this.len * this.life;

    const grad = c.createLinearGradient(tailX, tailY, this.x, this.y);
    grad.addColorStop(0,   `rgba(183,140,255,0)`);
    grad.addColorStop(0.6, `rgba(220,200,255,${this.life * 0.5})`);
    grad.addColorStop(1,   `rgba(255,255,255,${this.life * 0.95})`);

    c.save();
    c.strokeStyle = grad;
    c.lineWidth   = 1.5 * this.life;
    c.shadowColor = '#c4a0ff';
    c.shadowBlur  = 6;
    c.beginPath();
    c.moveTo(tailX, tailY);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.restore();
  }

  get dead() { return this.life <= 0 || this.x > W + 50 || this.y > H + 50; }
}

// spawn a shooter every 4–9 seconds
let nextShooter = 5000;
let lastTime = 0;

function maybeSpawnShooter(now) {
  if (now - lastTime > nextShooter) {
    shooters.push(new Shooter());
    lastTime    = now;
    nextShooter = 4000 + Math.random() * 5000;
  }
  shooters = shooters.filter(s => !s.dead);
}

// ─── MAIN LOOP ────────────────────────────────────────────────
function resize() {
  if (!canvas.value) return;
  W = canvas.value.width  = window.innerWidth;
  H = canvas.value.height = window.innerHeight;
  buildNebulae();
}

function init() {
  stars = Array.from({ length: STAR_COUNT }, () => new Star(true));
}

function loop(now = 0) {
  if (!ctx || !canvas.value) { raf = requestAnimationFrame(loop); return; }
  ctx.clearRect(0, 0, W, H);

  drawNebulae();

  maybeSpawnShooter(now);
  for (const s of shooters) { s.update(); s.draw(ctx); }

  for (const s of stars) { s.update(); s.draw(ctx); }

  raf = requestAnimationFrame(loop);
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  resize();
  init();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  raf = requestAnimationFrame(loop);
});

onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
</style>
