<template>
  <div>
    <Starfield />
    <WelcomeScreen v-if="!portfolioReady" @done="portfolioReady = true" />
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

const portfolioReady = ref(false);

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
});

onBeforeUnmount(() => {
  clearTimeout(typeTimerId);
  clearTimeout(pauseTimerId);
  window.removeEventListener("scroll", onScroll);
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
</style>
