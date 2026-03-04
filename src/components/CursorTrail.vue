<template>
  <canvas ref="canvas" class="cursor-trail" aria-hidden="true" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let ctx = null;
let raf = null;

// Each point stores position + timestamp
const TRAIL_LEN = 32;
const trail = [];

function onMouseMove(e) {
  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
  if (trail.length > TRAIL_LEN) trail.shift();
}

function resize() {
  if (!canvas.value) return;
  canvas.value.width  = window.innerWidth;
  canvas.value.height = window.innerHeight;
}

function loop() {
  if (!ctx || !canvas.value) { raf = requestAnimationFrame(loop); return; }
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const now = performance.now();
  const FADE_MS = 350; // trail fully gone after 350ms of no movement

  // Filter to only points within fade window
  const pts = trail.filter(p => now - p.t < FADE_MS);

  if (pts.length >= 2) {
    const passes = [
      { width: 9,   alpha: 0.15, blur: 16 },
      { width: 3.5, alpha: 0.40, blur: 7  },
      { width: 1.2, alpha: 0.90, blur: 2  },
    ];

    for (const pass of passes) {
      ctx.save();
      ctx.shadowColor = '#b78cff';
      ctx.shadowBlur  = pass.blur;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        // age fade: newest = 1, oldest = 0
        const ageFade = 1 - (now - p0.t) / FADE_MS;
        // position fade: tip is brightest
        const posFade = (i + 1) / pts.length;
        const alpha = ageFade * ageFade * posFade * pass.alpha;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(183,140,255,${alpha})`;
        ctx.lineWidth   = pass.width * posFade * ageFade;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Bright tip dot
    const tip = pts[pts.length - 1];
    const tipAge = 1 - (now - tip.t) / FADE_MS;
    if (tipAge > 0) {
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 10;
      ctx.fillStyle   = `rgba(240,220,255,${tipAge * 0.95})`;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  raf = requestAnimationFrame(loop);
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  resize();
  window.addEventListener('resize',    resize,      { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  raf = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('resize',    resize);
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.cursor-trail {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
}
</style>
