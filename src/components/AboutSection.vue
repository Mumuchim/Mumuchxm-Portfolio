<template>
  <section class="aboutSimple">
    <div class="aboutTop">
      <h2 class="aboutTitle">ABOUT ME</h2>

      <div class="aboutTabs" role="tablist" aria-label="About tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="aboutTab"
          :class="{ active: active === t.key }"
          @click="active = t.key"
          role="tab"
          :aria-selected="active === t.key"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="aboutCard">
      <p class="aboutText">{{ current.text }}</p>

      <div class="tagRow" v-if="current.tags?.length">
        <span class="tag" v-for="tag in current.tags" :key="tag">{{ tag }}</span>
      </div>

      <div class="actions">
        <button class="miniBtn" @click="copyEmail">
          {{ copied ? "COPIED!" : "COPY EMAIL" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const active = ref("overview");
const copied = ref(false);

const tabs = [
  { key: "overview", label: "OVERVIEW" },
  { key: "focus", label: "FOCUS" },
  { key: "stack", label: "TECH STACK" },
];

const content = {
  overview: {
    text:
      "I’m a Computer Science graduate based in the Philippines. I like building clean, interactive web interfaces and logic-driven features—simple UI, structured code.",
    tags: ["UI-Focused", "Logic-Driven", "Clean Design"],
  },
  focus: {
    text:
      "Right now I’m improving my Vue workflow (components, structure) while strengthening fundamentals for real-world teamwork and projects.",
    tags: ["Vue", "Frontend Workflow", "Team Growth"],
  },
  stack: {
    text:
      "Tools I’m comfortable with for projects and learning:",
    tags: ["Vue", "Vite", "JavaScript", "HTML/CSS", "C++", "Figma"],
  },
};

const current = computed(() => content[active.value]);

async function copyEmail() {
  try {
    await navigator.clipboard.writeText("cereneo.jeromeisaac@gmail.com");
    copied.value = true;
    setTimeout(() => (copied.value = false), 1200);
  } catch {
    // fallback: do nothing (clipboard may be blocked)
  }
}
</script>

<style scoped>
/* Uses your theme tokens */
.aboutSimple{
  padding: 18px 34px 0;
  margin-top: 24px;
}

.aboutTop{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.aboutTitle{
  margin: 0;
  font-family: var(--font-tech);
  letter-spacing: 1px;
  font-weight: 800;
  font-size: 18px;
  opacity: .9;
}

.aboutTabs{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
}

.aboutTab{
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 1px;
  padding: 9px 12px;
  border-radius: 999px;

  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.10);
  color: rgba(255,255,255,.70);

  cursor: pointer;
  transition: all .18s ease;
}

.aboutTab:hover{
  transform: translateY(-1px);
  border-color: rgba(255,255,255,.14);
  background: rgba(0,0,0,.24);
}

.aboutTab.active{
  color: rgba(255,255,255,.92);
  border-color: rgba(183,140,255,.38);
  background: rgba(183,140,255,.10);
  box-shadow: 0 0 0 3px rgba(183,140,255,.08) inset;
}

.aboutCard{
  border-radius: 14px;
  background: rgba(20,20,30,.52);
  border: 1px solid rgba(255,255,255,.10);
  backdrop-filter: blur(14px);

  padding: 16px;
  box-shadow:
    0 18px 45px rgba(0,0,0,.30),
    inset 0 1px 0 rgba(255,255,255,.06);
}

.aboutText{
  margin: 0;
  font-family: var(--font-sans);
  color: rgba(255,255,255,.72);
  line-height: 1.6;
  font-size: 14px;
  max-width: 820px;
}

.tagRow{
  margin-top: 12px;
  display:flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag{
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 1px;
  padding: 7px 10px;
  border-radius: 999px;

  color: rgba(255,255,255,.82);
  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.10);
}

.actions{
  margin-top: 14px;
  display:flex;
  justify-content: flex-end;
}

.miniBtn{
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 1px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;

  color: rgba(255,255,255,.88);
  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.10);
  transition: all .18s ease;
}

.miniBtn:hover{
  transform: translateY(-1px);
  border-color: rgba(183,140,255,.28);
  background: rgba(183,140,255,.08);
  box-shadow: 0 0 22px rgba(183,140,255,.10);
}

/* mobile spacing */
@media (max-width: 1100px){
  .aboutSimple{ padding: 12px 18px 0; }
  .aboutTop{ flex-direction: column; align-items: flex-start; }
}
</style>
