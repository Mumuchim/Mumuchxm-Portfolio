<template>
  <Transition name="welcome-fade">
    <div v-if="visible" class="welcome-overlay" @keydown.enter="handleEnter">
      <div class="welcome-bg">
        <div class="welcome-glow glow-1"></div>
        <div class="welcome-glow glow-2"></div>
        <div class="welcome-glow glow-3"></div>
        <div class="welcome-particles">
          <span v-for="i in 18" :key="i" class="particle" :style="particleStyle(i)"></span>
        </div>
      </div>

      <div class="welcome-card" :class="{ 'card-ready': cardReady }">
        <!-- Logo mark -->
        <div class="welcome-logo">
          <img class="logo-img" :src="logoImg" alt="MUMUCHXM Logo" />
        </div>

        <!-- Greeting line -->
        <p class="welcome-eyebrow">{{ eyebrowText }}</p>

        <!-- Main headline -->
        <h1 class="welcome-title">
          <span class="title-line">JEROME ISAAC CERENEO</span>
          <span class="title-line accent">MUMUCHXM</span>
          <span class="title-sub">PORTFOLIO</span>
        </h1>

        <!-- Divider -->
        <div class="welcome-divider">
          <span class="divider-line"></span>
          <span class="divider-icon">◆</span>
          <span class="divider-line"></span>
        </div>

        <!-- Copyright / ownership notice -->
        <div class="welcome-notice">
          <p class="notice-heading">⚠ Intellectual Property Notice</p>
          <p class="notice-body">
            All content displayed in this portfolio including but not limited to projects,
            source code, designs, written descriptions, certificates, artwork, and personal
            branding are <strong>exclusive intellectual property</strong> of <strong>Jerome Isaac Cereneo</strong>.
          </p>
          <p class="notice-body">
            Unauthorized reproduction, redistribution, or commercial use of any material
            found herein is strictly prohibited without prior written consent from the owner. <br>
            All rights reserved © {{ currentYear }} -  Mumuchxm.
          </p>
        </div>

        <!-- CTA -->
        <button class="welcome-btn" @click="handleEnter" tabindex="0">
          <span class="btn-text">ENTER PORTFOLIO</span>
          <span class="btn-arrow">→</span>
          <span class="btn-shine"></span>
        </button>

        <p class="welcome-hint">By entering, you acknowledge this notice.</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import logoImg from '../assets/mumuchxm_logo.png';
import { playEnter } from '../composables/useSfx.js';

const emit = defineEmits(['done']);

const visible = ref(true);
const cardReady = ref(false);
const eyebrowText = ref('');
const currentYear = new Date().getFullYear();

const greeting = 'Welcome to';
let charIdx = 0;

function typeGreeting() {
  if (charIdx <= greeting.length) {
    eyebrowText.value = greeting.slice(0, charIdx);
    charIdx++;
    setTimeout(typeGreeting, 70);
  }
}

function handleEnter() {
  playEnter();
  visible.value = false;
  setTimeout(() => emit('done'), 700);
}

function particleStyle(i) {
  const angle = (i / 18) * 360;
  const delay = (i * 0.18).toFixed(2);
  const size = 2 + (i % 3);
  return {
    '--angle': `${angle}deg`,
    '--delay': `${delay}s`,
    '--size': `${size}px`,
  };
}

onMounted(() => {
  setTimeout(() => {
    cardReady.value = true;
    typeGreeting();
  }, 120);
});
</script>

<style scoped>
/* ── Overlay ── */
.welcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060608;
  overflow-y: auto;
  padding: 16px 0;
}

/* ── Animated background ── */
.welcome-bg { position: absolute; inset: 0; pointer-events: none; }

.welcome-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0;
  animation: glowIn 1.8s ease forwards;
}

.glow-1 {
  width: 600px; height: 500px;
  top: -180px; left: -140px;
  background: radial-gradient(circle, rgba(108,74,168,.32), transparent 70%);
  animation-delay: .3s;
}
.glow-2 {
  width: 500px; height: 400px;
  bottom: -140px; right: -100px;
  background: radial-gradient(circle, rgba(183,140,255,.20), transparent 70%);
  animation-delay: .7s;
}
.glow-3 {
  width: 300px; height: 300px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(140,100,220,.10), transparent 70%);
  animation-delay: 1s;
}

@keyframes glowIn {
  to { opacity: 1; }
}

/* ── Particles ── */
.welcome-particles {
  position: absolute;
  inset: 0;
}
.particle {
  position: absolute;
  top: 50%; left: 50%;
  width: var(--size); height: var(--size);
  border-radius: 50%;
  background: rgba(183,140,255,.45);
  transform-origin: 0 0;
  animation: orbit 12s linear infinite;
  animation-delay: calc(var(--delay) * -1);
}
@keyframes orbit {
  0%   { transform: rotate(var(--angle)) translateX(clamp(160px,28vw,340px)) scale(1); opacity: .6; }
  50%  { opacity: .15; }
  100% { transform: rotate(calc(var(--angle) + 360deg)) translateX(clamp(160px,28vw,340px)) scale(1); opacity: .6; }
}

/* ── Card ── */
.welcome-card {
  position: relative;
  z-index: 2;
  width: min(680px, 92vw);
  border-radius: 22px;
  padding: clamp(16px, 2.5vh, 36px) clamp(24px, 5vw, 52px);
  text-align: center;

  background:
    radial-gradient(600px 300px at 50% 0%, rgba(168,140,255,.13), transparent 65%),
    linear-gradient(160deg, rgba(22,18,36,.95), rgba(10,8,20,.97));
  border: 1px solid rgba(255,255,255,.10);
  box-shadow:
    0 0 0 1px rgba(183,140,255,.08),
    0 40px 120px rgba(0,0,0,.75),
    inset 0 1px 0 rgba(255,255,255,.06);

  opacity: 0;
  transform: translateY(28px) scale(.97);
  transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
}
.welcome-card.card-ready {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ── Logo ── */
.welcome-logo { margin-bottom: 10px; }
.logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 0 18px rgba(183,140,255,.55));
}

/* ── Eyebrow ── */
.welcome-eyebrow {
  margin: 0 0 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(183,140,255,.7);
  min-height: 1.4em;
}

/* ── Title ── */
.welcome-title {
  margin: 0 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.title-line {
  display: block;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(11px, 2vw, 22px);
  font-weight: 900;
  letter-spacing: clamp(1px, .3vw, 3px);
  color: #ffffff;
  line-height: 1.1;
  white-space: nowrap;
}

.title-line.accent {
  color: #b78cff;
  font-size: clamp(22px, 4.5vw, 42px);
  letter-spacing: clamp(3px, .8vw, 8px);
  white-space: nowrap;
  text-shadow: 0 0 32px rgba(183,140,255,.45);
}

.title-sub {
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(10px, 2vw, 13px);
  font-weight: 700;
  letter-spacing: clamp(5px, 2vw, 14px);
  color: rgba(255,255,255,.38);
  margin-top: 2px;
  text-indent: clamp(5px, 2vw, 14px); /* compensate letter-spacing */
}

/* ── Divider ── */
.welcome-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px auto;
  width: min(360px, 80%);
}
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(183,140,255,.3), transparent);
}
.divider-icon {
  color: rgba(183,140,255,.5);
  font-size: 8px;
}

/* ── Notice ── */
.welcome-notice {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 16px;
  text-align: left;
}
.notice-heading {
  margin: 0 0 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: rgba(255,200,80,.85);
}
.notice-body {
  margin: 0 0 6px;
  font-size: clamp(10px, 1.5vw, 12px);
  line-height: 1.55;
  color: rgba(255,255,255,.60);
}
.notice-body:last-child { margin-bottom: 0; }
.notice-body strong { color: rgba(255,255,255,.85); font-weight: 700; }

/* ── Button ── */
.welcome-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 32px;
  border-radius: 50px;
  border: 1px solid rgba(183,140,255,.35);
  background: linear-gradient(135deg, rgba(108,74,168,.45), rgba(183,140,255,.18));
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(11px, 2vw, 13px);
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

.welcome-btn:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(183,140,255,.65);
  box-shadow: 0 12px 40px rgba(0,0,0,.45), 0 0 28px rgba(183,140,255,.28);
}
.welcome-btn:active { transform: translateY(0) scale(.99); }

.btn-arrow { font-size: 16px; transition: transform .2s; }
.welcome-btn:hover .btn-arrow { transform: translateX(4px); }

.btn-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.08) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform .5s ease;
}
.welcome-btn:hover .btn-shine { transform: translateX(100%); }

/* ── Hint ── */
.welcome-hint {
  margin: 10px 0 0;
  font-size: 11px;
  color: rgba(255,255,255,.28);
  letter-spacing: .5px;
}

/* ── Transition ── */
.welcome-fade-leave-active { transition: opacity .65s ease, transform .65s ease; }
.welcome-fade-leave-to { opacity: 0; transform: scale(1.03); }
</style>
