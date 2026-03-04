<template>
  <div class="bh-scene" aria-hidden="true">

    <!-- Starfield -->
    <div class="bh-stars">
      <span v-for="i in 55" :key="i" class="bh-star" :style="starStyle(i)"></span>
    </div>

    <!-- SVG black hole -->
    <svg class="bh-svg" viewBox="0 0 800 420" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1"/>
          <feGaussianBlur stdDeviation="8" result="blur2"/>
          <feMerge><feMergeNode in="blur2"/><feMergeNode in="blur1"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="14" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="groundGlow" cx="50%" cy="100%" r="55%" fx="50%" fy="100%">
          <stop offset="0%"   stop-color="#a855f7" stop-opacity="0.7"/>
          <stop offset="40%"  stop-color="#7c3aed" stop-opacity="0.35"/>
          <stop offset="80%"  stop-color="#4c1d95" stop-opacity="0.10"/>
          <stop offset="100%" stop-color="#000"    stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="30%"  stop-color="#e8d5ff" stop-opacity="0.9"/>
          <stop offset="70%"  stop-color="#b78cff" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Ground glow -->
      <ellipse cx="400" cy="420" rx="380" ry="80" fill="url(#groundGlow)" filter="url(#glow-soft)"/>

      <!-- Outer soft rings -->
      <g filter="url(#glow-soft)">
        <path :d="arc(400, 420, 380, 200)" fill="none" stroke="#4a1e8c" stroke-width="1.2" opacity="0.5" class="ring ring-7"/>
        <path :d="arc(400, 420, 320, 168)" fill="none" stroke="#6b28c2" stroke-width="1.5" opacity="0.6" class="ring ring-6"/>
        <path :d="arc(400, 420, 265, 140)" fill="none" stroke="#8b3fd4" stroke-width="1.8" opacity="0.7" class="ring ring-5"/>
      </g>
      <!-- Inner bright rings -->
      <g filter="url(#glow-strong)">
        <path :d="arc(400, 420, 215, 114)" fill="none" stroke="#a855f7" stroke-width="2"   opacity="0.80" class="ring ring-4"/>
        <path :d="arc(400, 420, 168, 90)"  fill="none" stroke="#c084fc" stroke-width="2.2" opacity="0.88" class="ring ring-3"/>
        <path :d="arc(400, 420, 124, 66)"  fill="none" stroke="#ddb6ff" stroke-width="2.5" opacity="0.93" class="ring ring-2"/>
        <path :d="arc(400, 420, 82,  44)"  fill="none" stroke="#f0e0ff" stroke-width="3"   opacity="1"    class="ring ring-1"/>
      </g>

      <!-- Core -->
      <ellipse cx="400" cy="422" rx="36" ry="18" fill="url(#coreGlow)" class="core"/>
      <ellipse cx="400" cy="422" rx="14" ry="7"  fill="white" opacity="0.95" filter="url(#glow-strong)" class="core-inner"/>
    </svg>

  </div>
</template>

<script setup>
function arc(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
}

function starStyle(i) {
  const s = i * 137.508;
  const x  = ((s * 9301 + 49297) % 233280) / 233280 * 100;
  const y  = ((s * 1234 + 5678)  % 233280) / 233280 * 100;
  const sz = ((s * 4321) % 100) / 100 * 1.8 + 0.6;
  const dl = ((s * 7777) % 100) / 100 * 5;
  const dr = 2 + ((s * 321) % 100) / 100 * 3;
  return {
    left: `${x}%`, top: `${y}%`,
    width: `${sz}px`, height: `${sz}px`,
    animationDelay: `${dl}s`,
    animationDuration: `${dr}s`,
  };
}
</script>

<style scoped>
.bh-scene {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
}

.bh-stars { position: absolute; inset: 0; pointer-events: none; }
.bh-star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  animation: starPulse 3s ease-in-out infinite;
}
@keyframes starPulse {
  0%,100% { opacity: 0.15; }
  50%      { opacity: 0.85; }
}

.bh-svg {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 100%;
}

.ring { animation: ringPulse 3s ease-in-out infinite; }
.ring-1 { animation-delay: 0s;    animation-duration: 2.6s; }
.ring-2 { animation-delay: 0.12s; animation-duration: 2.7s; }
.ring-3 { animation-delay: 0.24s; animation-duration: 2.8s; }
.ring-4 { animation-delay: 0.36s; animation-duration: 2.9s; }
.ring-5 { animation-delay: 0.48s; animation-duration: 3.0s; }
.ring-6 { animation-delay: 0.60s; animation-duration: 3.1s; }
.ring-7 { animation-delay: 0.72s; animation-duration: 3.2s; }

@keyframes ringPulse {
  0%,100% { opacity: 0.6; }
  50%      { opacity: 1;   }
}

.core, .core-inner { animation: corePulse 2.5s ease-in-out infinite; }
.core-inner { animation-delay: 0.2s; }
@keyframes corePulse {
  0%,100% { opacity: 0.85; }
  50%      { opacity: 1;    }
}
</style>
