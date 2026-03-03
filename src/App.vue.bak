<template>
  <div class="page">
    <div class="frame">
      <HeaderNav v-model:active="activeSection" />

      <section id="home">
        <HeroSection
          :avatar-img="avatarImg"
          :typed-text="typedText"
        />
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
    </div>

    <!-- Scroll to Top Button -->
    <teleport to="body">
      <button
        class="scrollTopBtn"
        :class="{ hidden: !showScrollTop }"
        @click="scrollToTop"
        aria-label="Scroll to top"
        title="Back to top"
      >
        ↑
      </button>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import HeaderNav from "./components/HeaderNav.vue";
import HeroSection from "./components/HeroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import SkillsSection from "./components/SkillsSection.vue";
import TimelineSection from "./components/TimelineSection.vue";

import pentoImg from "./assets/pento.png";
import jankenImg from "./assets/janken.png";
import quizlentineImg from "./assets/quizlentine.png";
import fixfinderImg from "./assets/fixfinder.png";
import avatarImg from "./assets/avatar.png";

/* ── Typing animation ── */
const words = ["Web Development", "Photo/Video Editing", "Game Development", "Automation"];
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

/* ── Active section ── */
const activeSection = ref("about");

/* ── Scroll to top ── */
const showScrollTop = ref(false);

function onScroll() {
  showScrollTop.value = window.scrollY > 320;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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
