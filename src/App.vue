<template>
  <div>
    <Starfield />
    <WelcomeScreen v-if="!portfolioReady" @done="onPortfolioReady" />
    <Transition name="portfolio-reveal">
      <div v-if="portfolioReady" class="page">
        <div class="frame">
          <HeaderNav v-model:active="activeSection" />
          <section id="home">
            <HeroSection :avatar-img="avatarImg" :typed-text="typedText" />
          </section>
          <section id="about" v-reveal>
            <AboutSection />
          </section>
          <section id="experience" v-reveal="{ delay: 40 }">
            <TimelineSection />
          </section>
          <section id="projects" v-reveal="{ delay: 60 }">
            <ProjectsSection
              :pento-img="pentoImg"
              :janken-img="jankenImg"
              :quizlentine-img="quizlentineImg"
              :fixfinder-img="fixfinderImg"
            />
          </section>
          <section id="skills" v-reveal="{ delay: 80 }">
            <SkillsSection />
          </section>
          <section id="extra" v-reveal="{ delay: 100 }">
            <Extras />
          </section>
          <FooterSection />
        </div>
        <teleport to="body">
          <button class="scrollTopBtn" :class="{ hidden: !showScrollTop }" @click="scrollToTop" aria-label="Scroll to top" title="Back to top">
            ↑
          </button>
          <button class="sfxToggleBtn" @click="toggleSfx" :title="sfxOn ? 'Mute SFX' : 'Unmute SFX'" :aria-label="sfxOn ? 'Mute sound effects' : 'Unmute sound effects'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <template v-if="sfxOn">
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </template>
              <template v-else>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </template>
            </svg>
          </button>
          <button class="bgmToggleBtn" @click="toggleBgm" :title="bgmOn ? 'Stop music' : 'Play music'" :aria-label="bgmOn ? 'Stop background music' : 'Play background music'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="bgmOn">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </template>
              <template v-else>
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="rgba(255,80,80,0.9)" stroke-width="2"/>
              </template>
            </svg>
          </button>
        </teleport>
      </div>
    </Transition>
  <CursorTrail />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import WelcomeScreen from "./components/WelcomeScreen.vue";
import HeaderNav from "./components/HeaderNav.vue";
import HeroSection from "./components/HeroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import SkillsSection from "./components/SkillsSection.vue";
import Extras from "./components/Extras.vue";
import TimelineSection from "./components/TimelineSection.vue";
import CursorTrail from "./components/CursorTrail.vue";
import FooterSection from "./components/FooterSection.vue";
import Starfield from "./components/Starfield.vue";
import pentoImg from "./assets/pento.png";
import jankenImg from "./assets/janken.png";
import quizlentineImg from "./assets/quizlentine.png";
import fixfinderImg from "./assets/fixfinder.png";
import avatarImg from "./assets/avatar.png";
import { setSfxEnabled, isSfxEnabled, startBgm, stopBgm, setBgmEnabled, isBgmEnabled, playClick, playHover } from "./composables/useSfx.js";
import bgmUrl from "./assets/bgm.mp3";

const portfolioReady = ref(false);
const sfxOn = ref(isSfxEnabled());
const bgmOn = ref(true);

function toggleSfx() {
  sfxOn.value = !sfxOn.value;
  setSfxEnabled(sfxOn.value);
}

function toggleBgm() {
  bgmOn.value = !bgmOn.value;
  setBgmEnabled(bgmOn.value);
  if (bgmOn.value) startBgm(bgmUrl);
}

function onPortfolioReady() {
  portfolioReady.value = true;
  setTimeout(() => startBgm(bgmUrl), 900);
}

// ── Global click & hover SFX ──────────────────────────────────────────────────
const CLICK_TARGETS  = 'button, a, [role="button"]';
const HOVER_TARGETS  = 'button, a, [role="button"]';
let _lastHoverEl = null;

function onGlobalClick(e) {
  const el = e.target.closest(CLICK_TARGETS);
  if (el) playClick();
}

function onGlobalMouseOver(e) {
  const el = e.target.closest(HOVER_TARGETS);
  if (el && el !== _lastHoverEl) {
    _lastHoverEl = el;
    playHover();
  }
}

function onGlobalMouseOut(e) {
  const el = e.target.closest(HOVER_TARGETS);
  if (el && el === _lastHoverEl) _lastHoverEl = null;
}

const words = ["Full-Stack Web Apps", "Game Development", "UI/UX Design", "Macro Automation", "Photo & Video Editing"];
const typedText = ref("");
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimerId = null;
let pauseTimerId = null;
const typeSpeed = 60;
const deleteSpeed = 40;
const pauseAfterWord = 900;

function typeEffect() {
  const current = words[wordIndex];
  if (!isDeleting) {
    typedText.value = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      clearTimeout(pauseTimerId);
      pauseTimerId = setTimeout(() => { isDeleting = true; }, pauseAfterWord);
    }
  } else {
    typedText.value = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  typeTimerId = setTimeout(typeEffect, isDeleting ? deleteSpeed : typeSpeed);
}

const activeSection = ref("about");
const showScrollTop = ref(false);

function onScroll() { showScrollTop.value = window.scrollY > 320; }
function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

onMounted(() => {
  typeEffect();
  const hash = location.hash?.slice(1);
  if (["about", "projects", "skills"].includes(hash)) activeSection.value = hash;
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onGlobalClick);
  document.addEventListener("mouseover", onGlobalMouseOver);
  document.addEventListener("mouseout", onGlobalMouseOut);
});

onBeforeUnmount(() => {
  clearTimeout(typeTimerId);
  clearTimeout(pauseTimerId);
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("click", onGlobalClick);
  document.removeEventListener("mouseover", onGlobalMouseOver);
  document.removeEventListener("mouseout", onGlobalMouseOut);
  stopBgm(true);
});
</script>

<style>
.portfolio-reveal-enter-active {
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(.22,1,.36,1);
}
.portfolio-reveal-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.sfxToggleBtn {
  position: fixed;
  bottom: 86px;
  right: 24px;
  z-index: 9000;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(18,18,28,.72);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
  box-shadow: 0 4px 18px rgba(0,0,0,.35);
}
.sfxToggleBtn:hover {
  transform: scale(1.1);
  border-color: rgba(183,140,255,.4);
  box-shadow: 0 6px 24px rgba(0,0,0,.4), 0 0 16px rgba(183,140,255,.2);
}

.bgmToggleBtn {
  position: fixed;
  bottom: 140px;
  right: 24px;
  z-index: 9000;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(18,18,28,.72);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
  box-shadow: 0 4px 18px rgba(0,0,0,.35);
  overflow: hidden;
}
.bgmToggleBtn:hover {
  transform: scale(1.1);
  border-color: rgba(183,140,255,.4);
  box-shadow: 0 6px 24px rgba(0,0,0,.4), 0 0 16px rgba(183,140,255,.2);
}
.bgmMuteLine {
  position: absolute;
  width: 2px;
  height: 130%;
  background: rgba(255, 80, 80, 0.85);
  transform: rotate(45deg);
  border-radius: 2px;
  pointer-events: none;
}
</style>
