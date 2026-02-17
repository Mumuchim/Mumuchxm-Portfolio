<template>
  <div class="page">
    <div class="frame">
      <HeaderNav :active="activeSection" />

      <!-- HOME -->
      <HeroSection
        id="home"
        :avatar-img="avatarImg"
        :typed-text="typedText"
      />

      <!-- ABOUT -->
      <AboutSection id="about" />

      <!-- PROJECTS -->
      <ProjectsSection id="projects" :pento-img="pentoImg" />

      <!-- SKILLS -->
      <SkillsSection id="skills" />

      <!-- CONTACT -->
      <ContactSection id="contact" />
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
import ContactSection from "./components/ContactSection.vue";

import pentoImg from "./assets/pento.png";
import avatarImg from "./assets/avatar.png";

/* Typing Logic */
const words = ["Web Development", "Video/Photo Editing", "Game Development", "Automation"];

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

/* Active section tracking */
const activeSection = ref("home");
let observer = null;

onMounted(() => {
  typeEffect();

  const sections = Array.from(document.querySelectorAll("section[id]"));
  const ratios = new Map();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));

      let bestId = null;
      let bestRatio = 0;

      for (const [id, r] of ratios.entries()) {
        if (r > bestRatio) {
          bestRatio = r;
          bestId = id;
        }
      }

      if (bestId) activeSection.value = bestId;
    },
    {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((s) => observer.observe(s));
});

onBeforeUnmount(() => {
  clearTimeout(typeTimerId);
  clearTimeout(pauseTimerId);
  if (observer) observer.disconnect();
});
</script>
