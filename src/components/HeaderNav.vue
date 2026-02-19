<template>
  <header class="topbar">
    <div class="brand">
      <div class="brandTop">Jerome Isaac Cereneo</div>
      <div class="brandRow">
        <span class="brandAccent">Mumuchxm</span>
        <span class="brandSlash">/</span>
        <span class="brandMain">Portfolio</span>
      </div>
    </div>

    <nav class="navlinks" aria-label="Primary">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        :class="{ active: active === link.id }"
        @click.prevent="go(link.id)"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";

const props = defineProps({
  active: { type: String, default: "about" },
});

const emit = defineEmits(["update:active"]);

const links = [
  { id: "about", label: "ABOUT ME" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
];

function headerOffsetPx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-h")
    .trim();
  const header = Number.parseInt(raw || "0", 10) || 0;
  return header + 18;
}

function setActiveByScroll() {
  const offset = headerOffsetPx();
  let current = links[0].id;

  for (const { id } of links) {
    const el = document.getElementById(id);
    if (!el) continue;

    const top = el.getBoundingClientRect().top;
    if (top - offset <= 0) current = id;
  }

  if (current !== props.active) {
    emit("update:active", current);
  }
}

function go(id) {
  const el = document.getElementById(id);
  if (!el) return;

  emit("update:active", id);

  const y = window.scrollY + el.getBoundingClientRect().top - headerOffsetPx();
  window.scrollTo({ top: y, behavior: "smooth" });

  history.replaceState(null, "", `#${id}`);
}

let rafId = 0;
function onScroll() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(setActiveByScroll);
}

onMounted(() => {
  if (location.hash) {
    const id = location.hash.slice(1);
    if (links.some((l) => l.id === id)) emit("update:active", id);
  }

  setActiveByScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.topbar{
  position: sticky;
  top: 0;
  z-index: 100;

  height: var(--header-h);
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding: 18px 34px 0;

  background: rgba(10,10,16,.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.brand{
  display:flex;
  flex-direction:column;
  gap: 6px;
  line-height: 1;
}

.brandTop{
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: .8px;
  color: rgba(255,255,255,.7);
  text-align: center;
  width: 230px;
}

.brandRow{
  display:flex;
  align-items:baseline;
  gap: 10px;
  font-family: var(--font-tech);
}

.brandAccent{
  color: var(--accent);
  font-weight: 800;
  font-size: 22px;
}

.brandSlash{
  color: rgba(255,255,255,.75);
  font-weight: 600;
  font-size: 18px;
}

.brandMain{
  color: rgba(255,255,255,.92);
  font-weight: 700;
  font-size: 22px;
}

/* NAV */
.navlinks{
  margin-top: 8px;
  display:flex;
  gap: 44px;
  font-family: var(--font-tech);
  align-items:center;
}

.navlinks a{
  text-decoration:none;
  font-size: 12px;
  letter-spacing: 1.1px;
  font-weight: 700;

  color: rgba(255,255,255,.85);
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;

  /* ✅ unify hover timing + glow feel */
  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease, background .25s ease, border-color .25s ease, color .25s ease;
  position: relative;
}

/* ✅ Unified hover: same vibe as hireBtn */
.navlinks a:hover{
  transform: translateY(-2px);
  background: rgba(183,140,255,.10);
  border-color: rgba(255,255,255,.10);
  color: rgba(255,255,255,.96);
  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    0 0 20px rgba(168,140,255,.25);
  filter: brightness(1.03);
}

.navlinks a:active{
  transform: translateY(0);
  box-shadow:
    0 6px 16px rgba(0,0,0,.30),
    0 0 12px rgba(168,140,255,.18);
}

/* ✅ Active (now also glows like hover) */
.navlinks a.active{
  color: var(--accent);
  background: rgba(183,140,255,.12);
  border-color: rgba(183,140,255,.32);
  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    0 0 20px rgba(168,140,255,.22);
}

/* Purple underline glow */
.navlinks a.active::after{
  content:"";
  position:absolute;
  left: 14px;
  right: 14px;
  bottom: -8px;
  height: 2px;
  border-radius: 999px;
  background: rgba(183,140,255,.85);
  box-shadow: 0 0 12px rgba(183,140,255,.25);
}

/* Responsive */
@media (max-width: 980px){
  .topbar{
    height: auto;
    padding: 14px 18px 12px;
    flex-direction: column;
    gap: 12px;
  }

  .brandTop{
    width: auto;
    text-align: left;
  }

  .navlinks{
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    gap: 10px 26px;
    justify-content: start;
  }

  .navlinks a{
    font-size: 11px;
  }

  .navlinks a.active::after{
    bottom: -6px;
  }
}

@media (max-width: 520px){
  .navlinks{
    grid-auto-flow: row;
    grid-template-columns: repeat(2, max-content);
    gap: 10px 22px;
  }
}
</style>
