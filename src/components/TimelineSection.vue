<template>
  <section :id="id" class="tabSection" ref="sectionRef">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">EXPERIENCE</h2>
      <p class="tabDesc">Education, work, and where I am now.</p>

      <div class="timeline" :class="{ stacked: isStacked }">
        <div
          v-for="(item, i) in events"
          :key="i"
          class="timelineItem"
          :class="item.type"
          :style="cardStyle(i)"
        >
          <!-- Line + dot -->
          <div class="timelineStem">
            <div class="timelineDot">
              <span class="dotIcon">{{ item.icon }}</span>
            </div>
            <div v-if="i < events.length - 1" class="timelineLine"></div>
          </div>

          <!-- Card -->
          <div class="timelineCard">
            <div class="timelineCardTop">
              <div class="timelineDate">{{ item.date }}</div>
              <div class="timelineTypeBadge" :class="item.type">{{ item.label }}</div>
            </div>
            <h3 class="timelineTitle">{{ item.title }}</h3>
            <div class="timelineOrg">{{ item.org }}</div>
            <p class="timelineDesc">{{ item.desc }}</p>

            <div v-if="item.tags && item.tags.length" class="timelineTags">
              <span v-for="tag in item.tags" :key="tag" class="timelineTag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

defineProps({
  id: { type: String, default: "experience" },
});

const sectionRef = ref(null);
const progress = ref(0); // 0 = stacked, 1 = fully expanded

// Where each card SITS when stacked — all piled near the top of the section,
// slightly offset so user can see it's a deck
const stackPos = [
  { x:   6, y:   0, rot:  2.8, zIndex: 3 }, // top card
  { x: -10, y:  14, rot: -3.5, zIndex: 2 }, // middle card peeking behind
  { x:  16, y:  24, rot:  1.5, zIndex: 1 }, // bottom card peeking
];

// Where each card ends up when fully expanded (normal timeline flow)
// marginBottom matches .timelineCard margin-bottom: 28px
const expandedY = [0, 1, 2].map(i => i * 210); // approx per-card height

function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function cardStyle(i) {
  const p = easeOut(progress.value);
  const s = stackPos[i] || { x: 0, y: 0, rot: 0, zIndex: 0 };

  const tx  = lerp(s.x, 0, p);
  // stacked: all cards at y≈0 area; expanded: each card at its natural position
  const ty  = lerp(s.y - expandedY[i], 0, p);
  const rot = lerp(s.rot, 0, p);

  return {
    transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
    zIndex:    progress.value < 0.15 ? s.zIndex : "auto",
    transition: progress.value < 0.05
      ? "none"                                          // snap instantly on page load
      : "transform 0.55s cubic-bezier(.22,1,.36,1)",
    position: "relative",
  };
}

const isStacked = computed(() => progress.value < 0.12);

function getHeaderHeight() {
  // Read the CSS variable --header-h set in styles.css
  return parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h')
  ) || 84;
}

function onScroll() {
  if (!sectionRef.value) return;
  const rect       = sectionRef.value.getBoundingClientRect();
  const headerH    = getHeaderHeight();

  // Trigger point: when the section title top aligns with the bottom of the header
  // rect.top <= headerH  →  header has reached the section title
  // Fully expanded 200px after that point
  const expandRange = 200;
  const raw = (headerH - rect.top) / expandRange;
  progress.value = Math.max(0, Math.min(1, raw));
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

const events = [
  {
    type: "education",
    label: "Education",
    icon: "🎓",
    date: "2021 — 2025",
    title: "BS Computer Science",
    org: "Dr. Yanga's Colleges, Inc.",
    desc: "Built foundations in Python, Java, web development, databases, and software engineering. Graduated June 2025.",
    tags: ["Python", "Java", "Web Dev", "Databases", "Software Engineering"],
  },
  {
    type: "work",
    label: "Full-time",
    icon: "💼",
    date: "Jul 2025 — Nov 2025 · 5 mos",
    title: "Marketing Associate",
    org: "Primcare Marketing Corporation · Plaridel, Central Luzon · On-site",
    desc: "Absorbed from internship into a full-time role as Sequence Builder and is responsible for creating, managing, and optimizing automated message sequences on Botcakes and Pancake platforms. Designed conditional logic workflows for personalized user engagement and monitored performance metrics to improve automation efficiency. Left in November to fully commit to software development.",
    tags: ["Sequence Builder", "Marketing Automation", "Botcakes", "Pancake", "Canva", "LLMs"],
  },
  {
    type: "now",
    label: "Now",
    icon: "🟢",
    date: "Nov 2025 — Present",
    title: "Open to Work",
    org: "Philippines · Remote-friendly",
    desc: "Pursuing software development full-time... and is building projects, sharpening skills, and looking for a junior dev role where I can contribute and grow.",
    tags: ["Vue", "React", "Python", "C++", "Open to Work"],
  },
];
</script>

<style scoped>
.timeline {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 0;
  /* allow rotated cards to show outside bounds */
  overflow: visible;
}

/* when stacked, reduce the section min-height so it doesnt leave a gap */
/* Reserve enough height for expanded state always so page doesn't jump */
.timeline {
  min-height: 650px;
}

/* hide stems when cards are overlapping */
.timeline.stacked .timelineStem {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.timeline:not(.stacked) .timelineStem {
  opacity: 1;
  transition: opacity 0.5s ease 0.3s;
}

/* stacked cards should show a grab cursor hint */
.timeline.stacked .timelineCard {
  cursor: default;
  box-shadow:
    0 24px 60px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.08);
}

.timelineItem {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Stem: dot + vertical line */
.timelineStem {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 44px;
}

.timelineDot {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(18, 18, 28, 0.9);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow:
    0 0 0 4px rgba(183,140,255,.08),
    0 8px 24px rgba(0,0,0,.35);
  display: grid;
  place-items: center;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: box-shadow .25s ease, border-color .25s ease;
}

.timelineItem.now .timelineDot {
  border-color: rgba(60, 200, 120, .40);
  box-shadow:
    0 0 0 5px rgba(60, 200, 120, .08),
    0 0 18px rgba(60, 200, 120, .20),
    0 8px 24px rgba(0,0,0,.35);
}

.timelineLine {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: linear-gradient(180deg, rgba(183,140,255,.25), rgba(183,140,255,.06));
  margin: 6px 0;
}

/* Card */
.timelineCard {
  flex: 1;
  margin-bottom: 28px;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(18,18,26,.55);
  border: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 36px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05);
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}

.timelineCard:hover {
  border-color: rgba(183,140,255,.22);
  box-shadow: 0 18px 48px rgba(0,0,0,.36), 0 0 20px rgba(168,140,255,.12);
  transform: translateY(-2px);
}

.timelineItem.now .timelineCard {
  border-color: rgba(60, 200, 120, .18);
  background: rgba(18,28,22,.55);
}

.timelineCardTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.timelineDate {
  font-family: Montserrat, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,.48);
  letter-spacing: .5px;
}

.timelineTypeBadge {
  font-family: Orbitron, sans-serif;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 20px;
}

.timelineTypeBadge.education {
  background: rgba(100,140,255,.12);
  border: 1px solid rgba(100,140,255,.28);
  color: #9ab4ff;
}

.timelineTypeBadge.work {
  background: rgba(183,140,255,.12);
  border: 1px solid rgba(183,140,255,.28);
  color: var(--accent);
}

.timelineTypeBadge.now {
  background: rgba(60,200,120,.12);
  border: 1px solid rgba(60,200,120,.35);
  color: #6ee89e;
}

.timelineTitle {
  margin: 0 0 4px;
  font-family: Orbitron, sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: .5px;
  color: rgba(255,255,255,.92);
}

.timelineOrg {
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  color: rgba(255,255,255,.50);
  margin-bottom: 10px;
}

.timelineDesc {
  margin: 0;
  font-family: Montserrat, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255,255,255,.72);
}

.timelineTags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.timelineTag {
  font-family: Montserrat, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .4px;
  padding: 3px 9px;
  border-radius: 20px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.10);
  color: rgba(255,255,255,.65);
}

@media (max-width: 600px) {
  .timelineCard { padding: 14px; }
  .timelineTitle { font-size: 13px; }
}
</style>
