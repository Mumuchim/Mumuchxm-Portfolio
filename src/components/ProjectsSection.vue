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
        title="project: QUIZLENTINE"
        desc="This is a custom made valentine invitation app for my girlfriend created using python tkinter."
      />
      <ProjectCard
        title="Janken Pom"
        desc="Discord bot that can make rock, paper, scissors with anyone that joined your match."
      />
      <ProjectCard
        title="FixFinder"
        desc="An web app that lets the user can place different type of pins for an specific report that will pop up in an interactive map."
      />
      <ProjectCard
        title="PentoBattle"
        desc="Coming Soon..."
        :img="pentoImg"
        :coming="true"
      />
    </section>
  </section>
</template>

<script setup>
import ProjectCard from "./ProjectCard.vue";

defineProps({
  id: { type: String, default: "projects" },
  pentoImg: { type: String, default: null },
});
</script>
