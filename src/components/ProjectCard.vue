<!-- src/components/ProjectCard.vue -->
<template>
  <article class="card" :class="{ localOnly }" ref="cardRef" @mousemove="onTilt" @mouseleave="resetTilt" :style="tiltStyle">
    <div class="thumb">
      <!-- Skeleton shimmer while loading -->
      <div v-if="img && !imgLoaded" class="thumbSkeleton"></div>

      <!-- IMAGE -->
      <img
        v-if="img"
        :src="img"
        class="thumbImg"
        :class="{ loaded: imgLoaded }"
        :alt="`${title} screenshot`"
        @load="imgLoaded = true"
      />

      <!-- FALLBACK -->
      <div v-else class="thumbFake"></div>

      <!-- Status badge pinned to top-right of thumbnail -->
      <span v-if="status === 'finished'" class="statusBadge finished">✔ Finished</span>
      <span v-else-if="status === 'in-progress'" class="statusBadge inprogress">⚙ In Progress</span>
      <span v-else-if="status === 'pending'" class="statusBadge pending">⏳ Pending Project</span>
    <!-- Local Only overlay -->
      <div v-if="localOnly" class="localOnlyOverlay">
        <span class="localOnlyIcon">💾</span>
        <span class="localOnlyLabel">Local Only</span>
      </div>
    </div>

    <div class="cardBody">
      <div class="cardTitleRow">
        <h3 class="cardTitle">{{ title }}</h3>
      </div>
      <p class="cardDesc">{{ desc }}</p>

      <!-- Mini tech stack icons with custom tooltips -->
      <div v-if="stack && stack.length" class="miniStack" aria-label="Project tech stack">
        <span
          v-for="s in stack"
          :key="s.name"
          class="tipWrap"
          :data-tip="s.name"
        >
          <img
            class="miniIcon"
            :src="s.icon"
            :alt="s.name"
            loading="lazy"
          />
        </span>
      </div>

      <div class="cardFooter">
        <button
          v-if="details"
          class="actionBtn detailsBtn"
          @click="openDetails()"
          title="View project details"
        >
          {{ details && details.concept ? 'Concept' : 'Details' }}
        </button>

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
  <!-- PROJECT DETAIL MODAL -->
  <teleport to="body">
    <div
      v-if="showDetail"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
      @click.self="closeDetails()"
    >
      <div class="modal detailModal">
        <button class="closeBtn" type="button" @click="closeDetails()" aria-label="Close">✕</button>

        <div class="detailHeader">
          <div class="detailMeta">
            <span v-if="status === 'finished'" class="statusBadge finished" style="position:static;backdrop-filter:none">✔ Finished</span>
            <span v-else-if="status === 'in-progress'" class="statusBadge inprogress" style="position:static;backdrop-filter:none">⚙ In Progress</span>
            <span v-else-if="status === 'pending'" class="statusBadge pending" style="position:static;backdrop-filter:none">⏳ Pending Project</span>
          </div>
          <h2 class="detailTitle">{{ title }}</h2>
        </div>

        <div v-if="img" class="detailThumb">
          <img :src="img" :alt="title" />
        </div>

        <div class="detailBody">
          <template v-if="details.concept">
            <div class="detailSection">
              <div class="detailSectionLabel">🎯 Vision</div>
              <p>{{ details.vision }}</p>
            </div>
            <div class="detailSection">
              <div class="detailSectionLabel">🌌 Inspiration</div>
              <p>{{ details.inspiration }}</p>
            </div>
            <div class="detailSection">
              <div class="detailSectionLabel">🛣 Roadmap</div>
              <p>{{ details.roadmap }}</p>
            </div>
          </template>
          <template v-else>
            <div v-if="details.problem" class="detailSection">
              <div class="detailSectionLabel">🔍 Problem</div>
              <p>{{ details.problem }}</p>
            </div>
            <div v-if="details.built" class="detailSection">
              <div class="detailSectionLabel">🔨 What I Built</div>
              <p>{{ details.built }}</p>
            </div>
            <div v-if="details.learned" class="detailSection">
              <div class="detailSectionLabel">💡 What I Learned</div>
              <p>{{ details.learned }}</p>
            </div>
          </template>
        </div>

        <div v-if="stack && stack.length" class="detailStack">
          <div class="detailSectionLabel">🛠 Stack</div>
          <div class="detailStackIcons">
            <span v-for="s in stack" :key="s.name" class="tipWrap" :data-tip="s.name">
              <img class="detailIcon" :src="s.icon" :alt="s.name" />
            </span>
          </div>
        </div>

        <div class="detailActions">
          <button v-if="video" class="actionBtn" @click="openDemo">Watch Demo</button>
          <button v-if="link" class="actionBtn primary" @click="openLink">Open Project <span class="arrow">→</span></button>
        </div>
      </div>
    </div>
  </teleport>

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
import { playCardHover, playClick, playModalOpen, playModalClose } from "../composables/useSfx.js";

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

  /* ✅ project status badge: 'finished' | 'in-progress' | null */
  status: { type: String, default: null },

  /* ✅ project detail write-up: { problem, built, learned } */
  details: { type: Object, default: null },

  /* ✅ local-only projects: dimmed with overlay */
  localOnly: { type: Boolean, default: false },
});

const showModal = ref(false);
const showDetail = ref(false);
const imgLoaded = ref(false);
const cardRef = ref(null);
const tiltX = ref(0);
const tiltY = ref(0);
const tiltStyle = ref({});

const _hovered = ref(false);

function onTilt(e) {
  const el = cardRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  - 0.5;
  const y = (e.clientY - rect.top)  / rect.height - 0.5;
  const rotY =  x * 12;
  const rotX = -y * 9;
  tiltStyle.value = {
    transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`,
    transition: 'transform 0.08s ease',
  };
  if (!_hovered.value) {
    _hovered.value = true;
    playCardHover();
  }
}

function resetTilt() {
  _hovered.value = false;
  tiltStyle.value = {
    transform: 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: 'transform 0.45s cubic-bezier(.22,1,.36,1)',
  };
}

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
  playClick();
  window.open(props.link, "_blank", "noopener,noreferrer");
}

function openDemo() {
  if (props.coming || !props.video) return;
  playClick();

  if (videoIsYoutube.value) {
    showModal.value = true;
    playModalOpen();
    return;
  }

  window.open(props.video, "_blank", "noopener,noreferrer");
}

function closeModal() {
  playModalClose();
  showModal.value = false;
}

function openDetails() {
  playModalOpen();
  showDetail.value = true;
}

function closeDetails() {
  playModalClose();
  showDetail.value = false;
}

function onKeydown(e) {
  if (e.key === "Escape") {
    if (showDetail.value) { closeDetails(); return; }
    if (showModal.value) closeModal();
  }
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
}

.card:hover{
  z-index: 50;
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
  opacity: 0;
  transition: transform .25s ease, opacity .35s ease;
}

.thumbImg.loaded{
  opacity: 1;
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

.cardTitleRow {
  margin-bottom: 8px;
}

.cardTitle{
  margin: 0;
  font-family: Orbitron, sans-serif;
  font-size: 13px;
  letter-spacing: .6px;
  font-weight: 800;
  color: rgba(255,255,255,.95);
}

/* Badge pinned to top-right corner of thumbnail */
.statusBadge {
  position: absolute;
  top: 9px;
  right: 9px;
  z-index: 15;

  font-family: Montserrat, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  padding: 4px 9px;
  border-radius: 20px;
  white-space: nowrap;

  backdrop-filter: blur(6px);
}

.statusBadge.finished {
  background: rgba(20, 80, 45, 0.72);
  border: 1px solid rgba(60, 200, 120, 0.50);
  color: #6ee89e;
  box-shadow: 0 2px 10px rgba(0,0,0,.35);
}

.statusBadge.inprogress {
  background: rgba(80, 55, 10, 0.72);
  border: 1px solid rgba(255, 180, 50, 0.50);
  color: #ffd97d;
  box-shadow: 0 2px 10px rgba(0,0,0,.35);
}

.statusBadge.pending {
  background: rgba(20, 40, 80, 0.72);
  border: 1px solid rgba(100, 160, 255, 0.50);
  color: #93c5fd;
  box-shadow: 0 2px 10px rgba(0,0,0,.35);
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
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 8px;
  margin-top: 12px;
}

.actionBtn{
  width: 100%;
  height: 34px;
  line-height: 1;
  padding: 0 10px;
  border-radius: 10px;

  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);

  color: white;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: .5px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  box-sizing: border-box;
  cursor: pointer;
  white-space: nowrap;

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
.detailsBtn {
  background: rgba(255,255,255,.05);
  border-color: rgba(255,255,255,.10);
  color: rgba(255,255,255,.72);
}

.detailsBtn:hover {
  background: rgba(183,140,255,.10);
  border-color: rgba(183,140,255,.28);
  color: var(--accent);
}

/* Detail Modal */
.detailModal {
  width: min(780px, 96vw);
  max-height: 88vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
}

.detailHeader {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 44px;
}

.detailMeta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.detailTitle {
  margin: 0;
  font-family: Orbitron, sans-serif;
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 800;
  letter-spacing: .6px;
  color: rgba(255,255,255,.95);
}

.detailThumb {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
  max-height: 240px;
  display: flex;
}

.detailThumb img {
  width: 100%;
  object-fit: cover;
  display: block;
}

.detailBody {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detailSection {
  padding: 14px;
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
}

.detailSection p {
  margin: 8px 0 0;
  font-family: Montserrat, sans-serif;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255,255,255,.78);
}

.detailSectionLabel {
  font-family: Orbitron, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255,255,255,.55);
}

.detailStack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detailStackIcons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.detailIcon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,.3));
}

.detailActions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1px solid rgba(255,255,255,.07);
}

/* Local-only card dimming */
.card.localOnly {
  opacity: 0.55;
  filter: grayscale(0.3);
}

.localOnlyOverlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(10,10,18,.52);
  backdrop-filter: blur(3px);
  border-radius: 0;
  pointer-events: none;
}

.localOnlyIcon {
  font-size: 24px;
  line-height: 1;
}

.localOnlyLabel {
  font-family: Orbitron, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,.72);
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.16);
  padding: 4px 11px;
  border-radius: 20px;
}
</style>