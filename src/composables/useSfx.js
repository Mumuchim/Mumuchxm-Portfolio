// src/composables/useSfx.js
// SFX: .wav files from src/assets/sfx/  (swap any file to change a sound)
// BGM: bgm.mp3 from src/assets/

// ── WAV imports — replace any of these files to change a sound ───────────────
import sfxHover      from '../assets/sfx/hover.wav';
import sfxClick      from '../assets/sfx/click.wav';
import sfxFlip       from '../assets/sfx/flip.wav';
import sfxModalOpen  from '../assets/sfx/modal-open.wav';
import sfxModalClose from '../assets/sfx/modal-close.wav';
import sfxEnter      from '../assets/sfx/enter.wav';
import sfxCardDeal1   from '../assets/sfx/card-deal-1.wav';
import sfxCardDeal2   from '../assets/sfx/card-deal-2.wav';
import sfxCardDeal3   from '../assets/sfx/card-deal-3.wav';
import sfxCardHover  from '../assets/sfx/card-hover.wav';

// ── Simple Audio pool so rapid-fire sounds overlap cleanly ───────────────────
let enabled = true;
const POOL_SIZE = 4;
const _pools = {};

function getPool(url) {
  if (!_pools[url]) {
    _pools[url] = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(url);
      a.preload = 'auto';
      return a;
    });
    _pools[url]._idx = 0;
  }
  return _pools[url];
}

function play(url, volume = 1.0) {
  if (!enabled) return;
  const pool = getPool(url);
  const audio = pool[pool._idx % POOL_SIZE];
  pool._idx++;
  audio.volume  = Math.max(0, Math.min(1, volume));
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUBLIC SFX  — just call these anywhere
// ═══════════════════════════════════════════════════════════════════════════════

export function playHover()      { play(sfxHover,      0.55); }
export function playClick()      { play(sfxClick,      0.75); }
export function playFlip()       { play(sfxFlip,       0.80); }
export function playModalOpen()  { play(sfxModalOpen,  0.70); }
export function playModalClose() { play(sfxModalClose, 0.65); }
export function playEnter()      { play(sfxEnter,      0.80); }
export function playCardHover()  { play(sfxCardHover,  0.50); }

export function playCardDeal(index = 0) {
  const files = [sfxCardDeal1, sfxCardDeal2, sfxCardDeal3];
  const url   = files[index] ?? files[files.length - 1];
  setTimeout(() => play(url, 0.65), index * 80);
}

export function setSfxEnabled(val) { enabled = val; }
export function isSfxEnabled()     { return enabled; }


// ═══════════════════════════════════════════════════════════════════════════════
//  BACKGROUND MUSIC  — HTML5 Audio (MP3 file)
// ═══════════════════════════════════════════════════════════════════════════════

let bgmEnabled = true;
let bgmAudio   = null;
const BGM_VOL  = 0.22;
let _fadeTimer = null;

export function startBgm(url) {
  if (!bgmEnabled || bgmAudio) return;

  bgmAudio         = new Audio(url);
  bgmAudio.loop    = true;
  bgmAudio.volume  = 0;
  bgmAudio.preload = 'auto';

  bgmAudio.play().then(() => {
    _fadeVolume(0, BGM_VOL, 4000);
  }).catch(() => {
    // Autoplay blocked — retry on first user gesture
    document.addEventListener('pointerdown', () => {
      bgmAudio && bgmAudio.play()
        .then(() => _fadeVolume(0, BGM_VOL, 4000))
        .catch(() => {});
    }, { once: true });
  });
}

function _fadeVolume(from, to, ms) {
  if (_fadeTimer) clearInterval(_fadeTimer);
  if (!bgmAudio) return;
  const steps    = 80;
  const interval = ms / steps;
  let   step     = 0;
  bgmAudio.volume = Math.max(0, Math.min(1, from));
  _fadeTimer = setInterval(() => {
    step++;
    const p = step / steps;
    if (bgmAudio) bgmAudio.volume = Math.max(0, Math.min(1, from + (to - from) * p));
    if (step >= steps) { clearInterval(_fadeTimer); _fadeTimer = null; }
  }, interval);
}

export function stopBgm(instant = false) {
  if (!bgmAudio) return;
  if (instant) {
    bgmAudio.pause();
    bgmAudio = null;
    if (_fadeTimer) { clearInterval(_fadeTimer); _fadeTimer = null; }
  } else {
    const vol = bgmAudio.volume;
    _fadeVolume(vol, 0, 1500);
    setTimeout(() => { if (bgmAudio) { bgmAudio.pause(); bgmAudio = null; } }, 1600);
  }
}

export function setBgmEnabled(val) {
  bgmEnabled = val;
  if (!val) stopBgm();
}
export function isBgmEnabled() { return bgmEnabled; }
