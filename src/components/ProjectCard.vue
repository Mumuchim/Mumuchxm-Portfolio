<!-- src/components/ProjectCard.vue -->
<template>
  <article class="card">
    <div class="thumb">
      <!-- ✅ IMAGE (default) -->
      <img v-if="img" :src="img" class="thumbImg" alt="project thumbnail" />

      <!-- ✅ FALLBACK -->
      <div v-else class="thumbFake"></div>
    </div>

    <div class="cardBody">
      <h3 class="cardTitle">{{ title }}</h3>
      <p class="cardDesc">{{ desc }}</p>

      <!-- ✅ Mini tech stack icons -->
      <div v-if="stack && stack.length" class="miniStack" aria-label="Project tech stack">
        <img
          v-for="s in stack"
          :key="s.name"
          class="miniIcon"
          :src="s.icon"
          :alt="s.name"
          :title="s.name"
          loading="lazy"
        />
      </div>

      <div class="cardFooter">
        <button
          v-if="video"
          class="actionBtn"
          :class="{ coming }"
          :disabled="coming"
          @click="openDemo"
          :title="coming ? 'Coming soon' : 'Watch demo'"
        >
          Demo
        </button>

        <button
          v-if="link"
          class="actionBtn primary"
          :class="{ coming }"
          :disabled="coming"
          @click="openLink"
          :title="coming ? 'Coming soon' : 'Open link'"
        >
          Redirect <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </article>

  <!-- ✅ VIDEO MODAL (only via View button) -->
  <teleport to="body">
    <div
      v-if="showModal"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Project preview"
      @click.self="closeModal"
    >
      <div class="modal">
        <button class="closeBtn" type="button" @click="closeModal" aria-label="Close">
          ✕
        </button>

        <!-- ✅ YouTube fullscreen preview -->
        <iframe
          v-if="videoIsYoutube"
          class="modalMedia"
          :src="youtubeEmbedUrl"
          title="project video"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>

        <!-- ✅ If no video, show small message (we normally won't hit this) -->
        <div v-else class="modalInfo">
          <p>No video preview available.</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, required: true },

  img: { type: String, default: null },

  /* ✅ YouTube link for modal (optional) */
  video: { type: String, default: null },

  coming: { type: Boolean, default: false },

  /* ✅ optional external link (if you want View button to open a link instead of modal) */
  link: { type: String, default: null },

  /* ✅ mini stack icons to show on the card */
  stack: { type: Array, default: () => [] },
});

const showModal = ref(false);

const videoIsYoutube = computed(() => {
  if (!props.video) return false;
  return /youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\//i.test(props.video);
});

const youtubeEmbedUrl = computed(() => {
  if (!videoIsYoutube.value) return null;

  const u = props.video;
  const m1 = u.match(/youtu\.be\/([^?&]+)/i);
  const m2 = u.match(/[?&]v=([^?&]+)/i);
  const m3 = u.match(/youtube\.com\/shorts\/([^?&]+)/i);
  const id = (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1]) || null;

  if (!id) return null;

  // autoplay + loop. controls=1 so user can pause/seek.
  // NOTE: YouTube looping requires playlist=<videoId>.
  return `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${id}`;
});

function openLink() {
  if (props.coming || !props.link) return;
  window.open(props.link, "_blank", "noopener,noreferrer");
}

function openDemo() {
  if (props.coming || !props.video) return;

  // YouTube → modal for better UX
  if (videoIsYoutube.value) {
    showModal.value = true;
    return;
  }

  // otherwise, just open in a new tab
  window.open(props.video, "_blank", "noopener,noreferrer");
}

function closeModal() {
  showModal.value = false;
}

function onKeydown(e) {
  if (e.key === "Escape" && showModal.value) closeModal();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
/* Card shell */
.card{
  border-radius: 14px;
  overflow: hidden;

  background: rgba(18,18,26,.55);
  backdrop-filter: blur(10px);

  border: 1px solid rgba(255,255,255,.10);
  box-shadow:
    0 20px 60px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.06);

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transform: translateY(0);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, filter .25s ease;
  will-change: transform;
}

.card:hover{
  z-index: 50;
  transform: translateY(-2px);
  border-color: rgba(183,140,255,.30);
  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    0 0 20px rgba(168,140,255,.25);
  filter: brightness(1.03);
}

/* Thumbnail */
.thumb{
  height: 132px;
  background: rgba(0,0,0,.35);
  position: relative;
  overflow:hidden;
}

.thumbImg{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  transition: transform .25s ease;
}

.card:hover .thumbImg{
  transform: scale(1.03);
}

.thumbFake{
  position:absolute;
  inset: 10px;
  border-radius: 10px;
  background:
    radial-gradient(80px 80px at 20% 30%, rgba(185,140,255,.22), transparent 60%),
    radial-gradient(120px 120px at 80% 60%, rgba(110,90,200,.18), transparent 60%),
    rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.10);
}

/* Body */
.cardBody{
  padding: 14px 14px 16px;
  display:flex;
  flex-direction:column;
  flex: 1;
  min-height: 158px;
}

.cardTitle{
  margin: 0 0 8px;
  font-family: Orbitron, sans-serif;
  font-size: 13px;
  letter-spacing: .6px;
  font-weight: 800;
  color: rgba(255,255,255,.95);
}

.cardDesc{
  margin: 0;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  line-height: 1.35;
  color: rgba(255,255,255,.72);
  flex: 1;
}

.miniStack{
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  opacity: 0.95;
}

.miniIcon{
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.25));
}

.cardFooter{
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.actionBtn{
  min-width: 100px;
  height: 34px;
  line-height: 1;
  padding: 0 16px;
  border-radius: 10px;

  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);

  color: white;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .6px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  box-sizing: border-box;

  cursor: pointer;

  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease, opacity .25s ease;
  box-shadow: 0 6px 20px rgba(0,0,0,.22);
}

.actionBtn.primary{
  background: linear-gradient(135deg, var(--purple), #8c6cff);
  border: 1px solid rgba(255,255,255,.15);
  box-shadow: 0 6px 20px rgba(108,74,168,.35);
}

.actionBtn:hover{
  transform: translateY(-2px);
  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    0 0 20px rgba(168,140,255,.35);
  filter: brightness(1.05);
}

.actionBtn:active{
  transform: translateY(0);
}

.actionBtn.coming,
.actionBtn:disabled{
  opacity: .65;
  cursor: not-allowed;
  filter: saturate(.8);
}

.arrow{
  transition: transform .25s ease;
}
.actionBtn:hover .arrow{
  transform: translateX(4px);
}

/* ✅ FULLSCREEN MODAL */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
}

.modal{
  width: min(1200px, 96vw);
  height: min(720px, 86vh);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(18,18,28,.92), rgba(10,10,18,.92));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 30px 95px rgba(0,0,0,.62);
  position: relative;
  overflow: hidden;
}

.modalMedia{
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  background: black;
}

.closeBtn{
  position: absolute;
  top: 12px;
  right: 12px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  cursor: pointer;
  z-index: 2;
}
</style>
