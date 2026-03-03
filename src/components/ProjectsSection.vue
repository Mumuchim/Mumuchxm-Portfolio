<template>
  <section :id="id" class="tabSection">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">PROJECTS</h2>
      <p class="tabDesc">
        Some of the things I built recently — personal projects, experiments, and systems I'm improving.
      </p>

      <!-- Tech Filter Bar -->
      <div class="filterBar" role="group" aria-label="Filter projects by technology">
        <button
          v-for="f in filters"
          :key="f.tag"
          class="filterBtn"
          :class="{ active: activeFilter === f.tag }"
          @click="activeFilter = f.tag"
        >
          <img v-if="f.icon" :src="f.icon" :alt="f.label" class="filterIcon" />
          {{ f.label }}
        </button>
      </div>

      <!-- Cards -->
      <section class="cardsRow">
        <TransitionGroup name="card-fade">
          <ProjectCard
            v-for="p in filteredProjects"
            :key="p.title"
            :title="p.title"
            :desc="p.desc"
            :img="p.img"
            :video="p.video"
            :link="p.link"
            :stack="p.stack"
            :status="p.status"
            :details="p.details"
            :local-only="p.localOnly"
            :coming="p.coming"
          />
        </TransitionGroup>
      </section>

      <p v-if="filteredProjects.length === 0" class="noResults">
        No projects match that filter yet.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import ProjectCard from "./ProjectCard.vue";

import pythonIcon    from "../assets/stack/python.png";
import canvaIcon     from "../assets/stack/canva.png";
import figmaIcon     from "../assets/stack/figma.png";
import htmlIcon      from "../assets/stack/html.png";
import cssIcon       from "../assets/stack/css.png";
import reactjsIcon   from "../assets/stack/reactjs.png";
import vueIcon       from "../assets/stack/vue.png";
import viteIcon      from "../assets/stack/vite.png";
import supabaseIcon  from "../assets/stack/supabase.png";
import vercelIcon    from "../assets/stack/vercel.png";

// ── Filter options ──────────────────────────────────────────
const filters = [
  { tag: "all",      label: "All",      icon: null },
  { tag: "react",    label: "React",    icon: reactjsIcon },
  { tag: "vue",      label: "Vue",      icon: vueIcon },
  { tag: "python",   label: "Python",   icon: pythonIcon },
  { tag: "supabase", label: "Supabase", icon: supabaseIcon },
];

const activeFilter = ref("all");

// ── Project data ─────────────────────────────────────────────
const projects = computed(() => [
  {
    title:  "FixFinder",
    desc:   "My college thesis — a community reporting web app. I created the original concept, led the group, and continue developing it independently post-graduation.",
    img:    null, // injected via prop below
    link:   "https://fix-finder-beta.vercel.app/",
    status: "finished",
    tags:   ["html", "css", "react", "vite", "canva", "supabase", "vercel"],
    details: {
      problem: 'Community issues like potholes, broken streetlights, and flooding often go unaddressed because there was no easy way to visualize and report them. I came up with the original concept for my thesis and led the group that built version 1.0.',
      built: 'The current version is an improved iteration beyond the original thesis build — redesigned and re-engineered by me alone after graduation. Users drop categorized pins (Infrastructure, Safety, Environment) on an interactive map, with reports persisting in real-time via Supabase. Built with React + Vite, deployed on Vercel. As the original concept creator and thesis group leader, I hold the intellectual right to continue developing it.',
      learned: "Leading a team project from concept to defense, then independently continuing it post-graduation. Learned how the version you ship for school and the version you're proud of can be very different things.",
    },
    stack: [
      { name: "HTML",     icon: htmlIcon     },
      { name: "CSS",      icon: cssIcon      },
      { name: "React",    icon: reactjsIcon  },
      { name: "Vite",     icon: viteIcon     },
      { name: "Canva",    icon: canvaIcon    },
      { name: "Supabase", icon: supabaseIcon },
      { name: "Vercel",   icon: vercelIcon   },
    ],
  },
  {
    title:  "PENTObattle",
    desc:   "A feature-rich Pentomino battle game with multiple modes, AI opponents, real-time ranked matches, lobbies, and full account support.",
    img:    null,
    link:   "https://pento-battle.vercel.app/",
    status: "in-progress",
    tags:   ["vue", "vite", "canva", "figma", "supabase", "vercel"],
    details: {
      problem: 'Inspired by my high school math teacher who ran Pentomino games in class — there was no digital version worth playing, so I decided to build one that actually has depth.',
      built: 'A full-featured browser game built with Vue + Vite and Supabase. Went far beyond the original concept: multiple game modes, an AI opponent with adjustable difficulty levels, real-time multiplayer (quick play, ranked, and custom lobbies), guest and account-based play, and a full matchmaking system. Learned Figma from scratch to design the UI, and used AI-assisted development to implement complex systems faster.',
      learned: 'Real-time game state sync, turn validation across clients, AI move evaluation, Figma UI/UX design, Supabase auth and database architecture, and how to scope and manage a project that keeps growing.',
    },
    stack: [
      { name: "Vue",      icon: vueIcon      },
      { name: "Vite",     icon: viteIcon     },
      { name: "Canva",    icon: canvaIcon    },
      { name: "Figma",    icon: figmaIcon    },
      { name: "Supabase", icon: supabaseIcon },
      { name: "Vercel",   icon: vercelIcon   },
    ],
  },
  {
    title:  "Janken Pom",
    desc:   "Discord bot that lets anyone play rock, paper, scissors with whoever joins your match.",
    img:    null,
    link:   "https://discord.com/oauth2/authorize?client_id=1439905828189503549",
    status: "finished",
    tags:   ["python"],
    details: {
      problem: 'Wanted a fun Discord bot that my friend group could use to settle arguments or just mess around with — something more interactive than a poll.',
      built: 'A Discord bot that hosts rock-paper-scissors matches. Players join a lobby, the bot manages turns, tracks wins, and announces results in the channel.',
      learned: 'Discord bot architecture with discord.py, managing async event loops, and how to design bot interactions that feel natural in a chat context.',
    },
    stack: [{ name: "Python", icon: pythonIcon }],
  },
  {
    title:  "project: QUIZLENTINE",
    desc:   "A custom valentine invitation app for my girlfriend, built with Python Tkinter — hence the vintage look :>",
    img:    null,
    video:  "https://youtu.be/3eaPQRMnJak",
    status: "finished",
    tags:   ["python", "canva"],
    details: {
      problem: 'Wanted to make a Valentine invitation for my girlfriend that was more memorable than a message — something she had to interact with.',
      built: 'A Python Tkinter desktop app that walks her through a short quiz about our relationship, ending with the invitation. Designed all assets in Canva.',
      learned: 'Building a GUI with Tkinter, packaging a Python app to run standalone, and that even a janky-looking project can be meaningful when made with care.',
    },
    stack: [
      { name: "Python", icon: pythonIcon },
      { name: "Canva",  icon: canvaIcon  },
    ],
  },
  {
    title:  "DYC-AI ChatBot",
    desc:   "A school chatbot for Dr. Yanga's Colleges built with a YouTube-guided PyTorch/NLTK base — our contribution was the full frontend, the entire knowledge base, and training the bot on real school data.",
    img:    null,
    link:   null,
    video:  null,
    status: "finished",
    localOnly: true,
    tags:   ["python", "flask"],
    details: {
      problem: "Dr. Yanga's Colleges had no automated way to handle repetitive student inquiries about admissions, enrollment, fees, and scholarships — staff answered the same questions manually every day.",
      built: "Built as a Software Engineering group project (BSCS-3A, 2023-2024). We followed a YouTube tutorial for the PyTorch + NLTK chatbot architecture and Flask deployment — our actual work was building both frontends from scratch, designing the full auth system (login/register via XAMPP/MySQL), and creating the entire knowledge base: 9 categories, 80+ intents covering admissions, enrollment, scholarships, discounts, exams, academic calendar, student services, disciplinary code, and campus locations. The bot is named DYChat. Currently local-only due to XAMPP and Conda dependencies.",
      learned: "How a trained intent-classification chatbot works end-to-end, Flask routing and templating, MySQL-backed auth, and how much work goes into a genuinely useful knowledge base — getting the bot to actually answer real student questions correctly was the hard part.",
    },
    stack: [
      { name: "Python", icon: pythonIcon },
      { name: "Flask",  icon: null },
    ],
  },
]);

// Inject images from props into project data
const props = defineProps({
  id:             { type: String, default: "projects" },
  pentoImg:       { type: String, default: null },
  jankenImg:      { type: String, default: null },
  quizlentineImg: { type: String, default: null },
  fixfinderImg:   { type: String, default: null },
});

const projectsWithImages = computed(() =>
  projects.value.map((p) => {
    if (p.title === "FixFinder")           return { ...p, img: props.fixfinderImg };
    if (p.title === "PENTObattle")         return { ...p, img: props.pentoImg };
    if (p.title === "Janken Pom")          return { ...p, img: props.jankenImg };
    if (p.title === "project: QUIZLENTINE") return { ...p, img: props.quizlentineImg };
    if (p.title === "DYC-AI ChatBot") return { ...p, img: null };
    return p;
  })
);

const filteredProjects = computed(() => {
  if (activeFilter.value === "all") return projectsWithImages.value;
  return projectsWithImages.value.filter((p) =>
    p.tags.includes(activeFilter.value)
  );
});
</script>

<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.cardsRow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

@media (max-width: 1100px) {
  .cardsRow { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 680px) {
  .cardsRow { grid-template-columns: 1fr; }
}
</style>
