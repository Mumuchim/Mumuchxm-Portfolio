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

    <!-- Desktop nav -->
    <nav class="navlinks" aria-label="Primary">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        :class="{ active: active === link.id, comingSoon: link.comingSoon }"
        @click.prevent="go(link.id)"
      >
        {{ link.label }}
        <span v-if="link.comingSoon" class="navBadge">soon</span>
      </a>
    </nav>

    <!-- Hamburger button (mobile only) -->
    <button
      class="hamburgerBtn"
      :class="{ open: menuOpen }"
      @click="menuOpen = !menuOpen"
      aria-label="Toggle menu"
      aria-expanded="menuOpen"
    >
      <span class="hamburgerLine"></span>
      <span class="hamburgerLine"></span>
      <span class="hamburgerLine"></span>
    </button>
  </header>

  <!-- Mobile drawer -->
  <teleport to="body">
    <div
      class="mobileDrawer"
      :class="{ open: menuOpen }"
      role="dialog"
      aria-label="Navigation menu"
      @click.self="menuOpen = false"
    >
      <button class="drawerClose" @click="menuOpen = false" aria-label="Close menu">✕</button>
      <a
        v-for="link in links"
        :key="link.id"
        class="mobileDrawerLink"
        :class="{ active: active === link.id, comingSoon: link.comingSoon }"
        :href="`#${link.id}`"
        @click.prevent="goMobile(link.id)"
      >
        {{ link.label }}
        <span v-if="link.comingSoon" class="navBadge">soon</span>
      </a>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";

const props = defineProps({
  active: { type: String, default: "about" },
});

const emit = defineEmits(["update:active"]);
const menuOpen = ref(false);

const links = [
  { id: "home",       label: "HOME"       },
  { id: "about",      label: "ABOUT ME"   },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects",   label: "PROJECTS"   },
  { id: "skills",     label: "EXTRAS",    comingSoon: true },
];

function headerOffsetPx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-h").trim();
  return (parseInt(raw || "0", 10) || 0) + 18;
}

function setActiveByScroll() {
  const offset = headerOffsetPx();
  let current = links[0].id;
  for (const { id } of links) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - offset <= 0) current = id;
  }
  if (current !== props.active) emit("update:active", current);
}

function go(id) {
  const el = document.getElementById(id);
  if (!el) return;
  emit("update:active", id);
  const y = window.scrollY + el.getBoundingClientRect().top - headerOffsetPx();
  window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function goMobile(id) {
  menuOpen.value = false;
  setTimeout(() => go(id), 200);
}

let rafId = 0;
function onScroll() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(setActiveByScroll);
}

function onKeydown(e) {
  if (e.key === "Escape" && menuOpen.value) menuOpen.value = false;
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
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  window.removeEventListener("keydown", onKeydown);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.topbar{
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-h);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 34px 0;
  background: rgba(10,10,16,.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.brand{
  display: flex;
  flex-direction: column;
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
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-tech);
}

.brandAccent{ color: var(--accent); font-weight: 800; font-size: 22px; }
.brandSlash { color: rgba(255,255,255,.75); font-weight: 600; font-size: 18px; }
.brandMain  { color: rgba(255,255,255,.92); font-weight: 700; font-size: 22px; }

/* Desktop NAV */
.navlinks{
  margin-top: 8px;
  display: flex;
  gap: 44px;
  font-family: var(--font-tech);
  align-items: center;
}

.navlinks a{
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 1.1px;
  font-weight: 700;
  color: rgba(255,255,255,.85);
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease, background .25s ease, border-color .25s ease, color .25s ease;
  position: relative;
}

.navlinks a:hover{
  transform: translateY(-2px);
  background: rgba(183,140,255,.10);
  border-color: rgba(255,255,255,.10);
  color: rgba(255,255,255,.96);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), 0 0 20px rgba(168,140,255,.25);
  filter: brightness(1.03);
}

.navlinks a:active{ transform: translateY(0); }

.navlinks a.active{
  color: var(--accent);
  background: rgba(183,140,255,.12);
  border-color: rgba(183,140,255,.32);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), 0 0 20px rgba(168,140,255,.22);
}

.navlinks a.active::after{
  content: "";
  position: absolute;
  left: 14px; right: 14px; bottom: -8px;
  height: 2px;
  border-radius: 999px;
  background: rgba(183,140,255,.85);
  box-shadow: 0 0 12px rgba(183,140,255,.25);
}

.navlinks a.comingSoon {
  opacity: 0.52;
}

.navlinks a.comingSoon:hover {
  opacity: 0.75;
}

.navBadge {
  display: inline-block;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .8px;
  text-transform: uppercase;
  padding: 2px 5px;
  border-radius: 6px;
  background: rgba(255,180,50,.15);
  border: 1px solid rgba(255,180,50,.30);
  color: #ffd97d;
  margin-left: 5px;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

/* Responsive — tablet */
@media (max-width: 980px){
  .topbar{ height: auto; padding: 14px 18px 12px; flex-direction: column; gap: 12px; }
  .brandTop{ width: auto; text-align: left; }
  .navlinks{ display: grid; grid-auto-flow: column; grid-auto-columns: max-content; gap: 10px 26px; justify-content: start; }
  .navlinks a{ font-size: 11px; }
  .navlinks a.active::after{ bottom: -6px; }
}

@media (max-width: 600px){
  .topbar{ flex-direction: row; align-items: center; padding: 14px 18px; height: auto; }
  .navlinks{ display: none; }
  .brandTop{ display: none; }
}
</style>
