<!-- src/components/ProjectsSection.vue -->
<template>
  <section :id="id" class="tabSection">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">PROJECTS</h2>
      <p class="tabDesc">
        Some of the things I built recently — personal projects, experiments, and systems I’m improving.
      </p>
    </div>

    <section class="cardsRow">

      <ProjectCard
        title="FixFinder"
        desc="An web app that lets the user can place different type of pins for an specific report that will pop up in an interactive map."
        :img="fixfinderImg"
        link="https://fix-finder-beta.vercel.app/"
        :stack="fixFinderStack"
      />

      <ProjectCard
        title="PENTObattle"
        desc="Play 1v1 Pentomino with your friends. Inspired by my math highschool teacher idea."
        :img="pentoImg"
        link="https://pento-battle.vercel.app/"
        :stack="pentoStack"
      />

      <ProjectCard
        title="Janken Pom"
        desc="Discord bot that can make rock, paper, scissors with anyone that joined your match."
        :img="jankenImg"
        link="https://discord.com/oauth2/authorize?client_id=1439905828189503549"
        :stack="jankenStack"
      />

      <ProjectCard
        title="project: QUIZLENTINE"
        desc="This is a custom made valentine invitation app for my girlfriend created using python tkinter that's why it's old looking and buggy :<"
        :img="quizlentineImg"
        video="https://youtu.be/3eaPQRMnJak"
        :stack="quizlentineStack"
      />
      
    </section>
  </section>
</template>

<script setup>
import ProjectCard from "./ProjectCard.vue";

import pythonIcon from "../assets/stack/python.png";
import canvaIcon from "../assets/stack/canva.png";
import figmaIcon from "../assets/stack/figma.png";
import htmlIcon from "../assets/stack/html.png";
import cssIcon from "../assets/stack/css.png";
import reactjsIcon from "../assets/stack/reactjs.png";
import vueIcon from "../assets/stack/vue.png";
import viteIcon from "../assets/stack/vite.png";
import supabaseIcon from "../assets/stack/supabase.png";
import vercelIcon from "../assets/stack/vercel.png";

defineProps({
  id: { type: String, default: "projects" },
  pentoImg: { type: String, default: null },
  jankenImg: { type: String, default: null },
  quizlentineImg: { type: String, default: null },
  fixfinderImg: { type: String, default: null },
});

const quizlentineStack = [
  { name: "Python", icon: pythonIcon },
  { name: "Canva", icon: canvaIcon },
];

const fixFinderStack = [
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
  { name: "React", icon: reactjsIcon },
  { name: "Vite", icon: viteIcon },
  { name: "Canva", icon: canvaIcon },
  { name: "Supabase", icon: supabaseIcon },
  { name: "Vercel", icon: vercelIcon },
];

const pentoStack = [
  { name: "Vue", icon: vueIcon },
  { name: "Vite", icon: viteIcon },
  { name: "Canva", icon: canvaIcon },
  { name: "Figma", icon: figmaIcon },
  { name: "Supabase", icon: supabaseIcon },
  { name: "Vercel", icon: vercelIcon },
];

const jankenStack = [{ name: "Python", icon: pythonIcon }];
</script>
