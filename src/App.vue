<template>
  <div class="page">
    <div class="frame">
      <!-- ✅ Use HeaderNav as the single source of truth -->
      <HeaderNav v-model:active="activeSection" />

      <!-- HOME (not in nav) -->
      <section id="home">
        <HeroSection
          :avatar-img="avatarImg"
          :typed-text="typedText"
        />
      </section>

      <!-- ✅ Wrap sections so the ID is guaranteed on a real DOM section -->
      <section id="about">
        <AboutSection />
      </section>

      <section id="projects">
    <ProjectsSection
      :pento-img="pentoImg"
      :janken-img="jankenImg"
      :quizlentine-img="quizlentineImg"
    />
  </section>

      <section id="skills">
        <SkillsSection />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import HeaderNav from "./components/HeaderNav.vue";

import HeroSection from "./components/HeroSection.vue";
import AboutSection from "./components/AboutSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import SkillsSection from "./components/SkillsSection.vue";

import pentoImg from "./assets/pento.png";
import jankenImg from "./assets/janken.png";
import quizlentineImg from "./assets/quizlentine.png";
import avatarImg from "./assets/avatar.png";

/* Typing Logic */
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
      pauseTimerId = setTimeout(() => {
        isDeleting = true;
      }, pauseAfterWord);
    }
  } else {
    typedText.value = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const delay = isDeleting ? deleteSpeed : typeSpeed;
  typeTimerId = setTimeout(typeEffect, delay);
}

/* ✅ Active section controlled by HeaderNav only */
const activeSection = ref("about");

onMounted(() => {
  typeEffect();

  // Optional: if user lands with hash, reflect it immediately
  const hash = location.hash?.slice(1);
  if (hash === "about" || hash === "projects" || hash === "skills") {
    activeSection.value = hash;
  }
});

onBeforeUnmount(() => {
  clearTimeout(typeTimerId);
  clearTimeout(pauseTimerId);
});
</script>
