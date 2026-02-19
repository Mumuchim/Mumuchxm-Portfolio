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
      <!-- ===== OVERVIEW ===== -->
      <template v-if="active === 'overview'">
        <div class="overviewWrap">
          <div class="overviewFx" aria-hidden="true"></div>

          <!-- ✅ HTML typing (bold works while typing) -->
          <p class="aboutText aboutTextBig">
            <span v-html="overviewHtml"></span>
            <span v-if="isTyping" class="aboutCaret"></span>
          </p>
        </div>

        <div class="tagRow" v-if="content.overview.tags?.length">
          <span class="tag" v-for="tag in content.overview.tags" :key="tag">
            {{ tag }}
          </span>
        </div>
      </template>

      <!-- ===== CERTIFICATIONS ===== -->
      <template v-else-if="active === 'certs'">
        <div class="sectionHead">
          <div class="sectionTitle">CERTIFICATIONS</div>
          <div class="sectionHint">Click a card to preview.</div>
        </div>

        <div class="certGrid">
          <article
            class="certCard"
            v-for="c in certs"
            :key="c.title"
            role="button"
            tabindex="0"
            @click="openPreview(c)"
            @keydown.enter.prevent="openPreview(c)"
            @keydown.space.prevent="openPreview(c)"
          >
            <div class="certThumb" v-if="c.img">
              <img :src="c.img" :alt="`${c.title} certificate`" />
              <div class="certThumbFade"></div>
            </div>

            <div class="certTop">
              <div class="certBadge">{{ c.type }}</div>
              <div class="certDate">{{ c.date }}</div>
            </div>

            <div class="certBody">
              <h3 class="certTitle">{{ c.title }}</h3>
              <p class="certOrg">{{ c.org }}</p>
              <p class="certDesc">{{ c.desc }}</p>
            </div>

            <div class="certFooter certFooterRight">
              <a
                v-if="c.link"
                class="certLink"
                :href="c.link"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                Verify →
              </a>
              <span v-else class="certLink ghost">Preview →</span>
            </div>
          </article>
        </div>
      </template>

      <!-- ===== TECH STACK ===== -->
      <template v-else>
        <div class="sectionHead">
          <div class="sectionTitle">TECH STACK</div>
        </div>

        <!-- ✅ Languages tier block -->
        <div class="stackBlock">
          <div class="stackTitle">LANGUAGES (KNOWS BASIC SYNTAX)</div>

          <div class="stackGroup">
            <div class="stackLabel">FAMILIAR</div>
            <div class="stackRow" aria-label="Familiar languages">
              <div class="logoChip" v-for="s in langFamiliar" :key="s.name">
                <img class="logoImg" :src="s.icon" :alt="s.name" />
                <div class="logoName">{{ s.name }}</div>
              </div>
            </div>
          </div>

          <div class="stackGroup">
            <div class="stackLabel">WORKING KNOWLEDGE</div>
            <div class="stackRow" aria-label="Working knowledge languages">
              <div class="logoChip" v-for="s in langWorking" :key="s.name">
                <img class="logoImg" :src="s.icon" :alt="s.name" />
                <div class="logoName">{{ s.name }}</div>
              </div>
            </div>
          </div>

          <div class="stackGroup">
            <div class="stackLabel">NOT CONFIDENT / SLIGHT EXPOSURE</div>
            <div class="stackRow" aria-label="Exposure languages">
              <div class="logoChip" v-for="s in langExposure" :key="s.name">
                <img class="logoImg" :src="s.icon" :alt="s.name" />
                <div class="logoName">{{ s.name }}</div>
              </div>
            </div>
          </div>

          <div class="stackFlow">
            Familiar: Python, C++ • Working: JS/HTML/CSS • Exposure: C#, Java, SQL
          </div>
        </div>

        <div class="stackBlock">
          <div class="stackTitle">WEB DEV STACK</div>
          <div class="stackRow" aria-label="Web dev stack logos">
            <div class="logoChip" v-for="s in webStack" :key="s.name">
              <img class="logoImg" :src="s.icon" :alt="s.name" />
              <div class="logoName">{{ s.name }}</div>
            </div>
          </div>

          <div class="stackFlow">
            Figma → Vue + Vite → Bootstrap → Supabase → Vercel
          </div>
        </div>

        <div class="stackBlock">
          <div class="stackTitle">2D GAME DEV STACK (C# + Pixel Art)</div>
          <div class="stackRow" aria-label="2D game dev stack logos">
            <div class="logoChip" v-for="s in gameStack" :key="s.name">
              <img class="logoImg" :src="s.icon" :alt="s.name" />
              <div class="logoName">{{ s.name }}</div>
            </div>
          </div>

          <div class="stackFlow">
            Aseprite → Unity → WebGL → itch.io
          </div>
        </div>

        <!-- ✅ NEW: ADDITIONAL TOOLS (with ChatGPT logo) -->
        <div class="stackBlock">
          <div class="stackTitle">ADDITIONAL TOOLS</div>

          <div class="stackRow" aria-label="Additional tools logos">
            <div class="logoChip" v-for="s in additionalTools" :key="s.name">
              <img class="logoImg" :src="s.icon" :alt="s.name" />
              <div class="logoName">{{ s.name }}</div>
            </div>
          </div>

          <div class="stackFlow">
            These are my extra softwares.
          </div>
        </div>
      </template>
    </div>

    <!-- ✅ CERT PREVIEW MODAL -->
    <teleport to="body">
      <div
        v-if="preview"
        class="certOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Certificate preview"
        @click.self="closePreview"
      >
        <div class="certModal">
          <button
            class="certClose"
            type="button"
            @click="closePreview"
            aria-label="Close"
          >
            ✕
          </button>

          <div class="certModalHead">
            <div class="certModalTitle">{{ preview.title }}</div>
            <div class="certModalSub">{{ preview.org }} • {{ preview.date }}</div>
          </div>

          <div class="certModalImgWrap" v-if="preview.img">
            <img class="certModalImg" :src="preview.img" :alt="preview.title" />
          </div>

          <div class="certModalActions">
            <a
              v-if="preview.link"
              class="certModalBtn"
              :href="preview.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify →
            </a>

            <button class="certModalBtn primary" type="button" @click="closePreview">
              OK
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

/* ✅ Replace icons with your actual file paths in /src/assets/ */
import figmaIcon from "../assets/stack/figma.png";
import vueIcon from "../assets/stack/vue.png";
import viteIcon from "../assets/stack/vite.png";
import bootstrapIcon from "../assets/stack/bootstrap.png";
import supabaseIcon from "../assets/stack/supabase.png";
import vercelIcon from "../assets/stack/vercel.png";
import railwayIcon from "../assets/stack/railway.png";
import asepriteIcon from "../assets/stack/aseprite.png";
import unityIcon from "../assets/stack/unity.png";
import webglIcon from "../assets/stack/webgl.png";
import itchIcon from "../assets/stack/itch.png";

/* ✅ NEW: Language icons (put them in src/assets/stack/) */
import pythonIcon from "../assets/stack/python.png";
import cppIcon from "../assets/stack/cpp.png";
import jsIcon from "../assets/stack/javascript.png";
import htmlIcon from "../assets/stack/html.png";
import cssIcon from "../assets/stack/css.png";
import csharpIcon from "../assets/stack/csharp.png";
import javaIcon from "../assets/stack/java.png";
import sqlIcon from "../assets/stack/sql.png";

/* ✅ NEW: Additional tools icons (put them in src/assets/stack/) */
import uipathIcon from "../assets/stack/uipath.png";
import macroIcon from "../assets/stack/macro.png";
import capcutIcon from "../assets/stack/capcut.png";
import canvaIcon from "../assets/stack/canva.png";
import vscodeIcon from "../assets/stack/vscode.png";
import chatgptIcon from "../assets/stack/chatgpt.png";

/* ✅ Certification images (put them in src/assets/certs/) */
import diplomaImg from "../assets/certs/diploma.png";
import mosCertImg from "../assets/certs/mos_cert.png";
import oracleCertImg from "../assets/certs/oracle_cert.png";
import ciscoCertImg from "../assets/certs/cisco_cert.png";
import soloCppIntroImg from "../assets/certs/solo_cpp_intro.png";
import soloCppInterImg from "../assets/certs/solo_cpp_intermediate.png";

const active = ref("overview");

const tabs = [
  { key: "overview", label: "OVERVIEW" },
  { key: "stack", label: "TECH STACK" },
  { key: "certs", label: "CERTIFICATIONS" },
];

/* ✅ Overview content (shorter) */
const content = {
  overview: {
    tags: ["Newbie", "Full Stack", "Open to Work"],
  },
};

/* ======================================================
   ✅ HTML TYPING SYSTEM (bold works while typing)
   ====================================================== */
const overviewModel = [
  { type: "text", value: "Graduated with a " },
  { type: "bold", value: "BS Computer Science" },
  {
    type: "text",
    value: " (Dr. Yanga's Colleges, Inc. — June 2025) with foundations in ",
  },
  { type: "bold", value: "Python" },
  { type: "text", value: ", " },
  { type: "bold", value: "Java" },
  { type: "text", value: ", and " },
  { type: "bold", value: "Web development" },
  { type: "text", value: " using" },
  { type: "bold", value: " Vanilla JS, HTML, CSS" },
  { type: "text", value: " but i don't really use those anymore." },
  { type: "br" },
  { type: "br" },
  { type: "text", value: "My internship at " },
  { type: "bold", value: "PrimCare Marketing" },
  { type: "text", value: " strengthened my advertising knowledge also my " },
  { type: "bold", value: "photo/video editing" },
  { type: "text", value: " and practical use of " },
  { type: "bold", value: "LLMs" },
  { type: "text", value: ". Now wanting a career in " },
  { type: "bold", value: "software development " },
  {
    type: "text",
    value:
      "— I'm not yet confident with my skills in programming but I'm always ready to learn any language and contribute to real projects",
  },
  { type: "bold", value: " if given a chance." },
];

const overviewHtml = ref("");
const isTyping = ref(false);

let _timer = null;
let seg = 0;
let ch = 0;

function renderTypedHtml(segIndex, charIndex) {
  let out = "";

  for (let i = 0; i < overviewModel.length; i++) {
    const item = overviewModel[i];

    // fully completed segments
    if (i < segIndex) {
      if (item.type === "text") out += escapeHtml(item.value);
      else if (item.type === "bold") out += `<b>${escapeHtml(item.value)}</b>`;
      else if (item.type === "br") out += "<br>";
      continue;
    }

    // current segment (partial)
    if (i === segIndex) {
      if (item.type === "br") {
        // treat <br> as instant segment
        out += "<br>";
      } else {
        const partial = item.value.slice(0, charIndex);
        if (item.type === "text") out += escapeHtml(partial);
        if (item.type === "bold") out += `<b>${escapeHtml(partial)}</b>`;
      }
      break;
    }

    // future segments not yet typed => nothing
    break;
  }

  return out;
}

function startOverviewTyping() {
  window.clearInterval(_timer);
  _timer = null;

  seg = 0;
  ch = 0;
  overviewHtml.value = "";
  isTyping.value = true;

  _timer = window.setInterval(() => {
    const item = overviewModel[seg];
    if (!item) {
      window.clearInterval(_timer);
      _timer = null;
      isTyping.value = false;
      return;
    }

    if (item.type === "br") {
      // commit <br> and move on
      overviewHtml.value = renderTypedHtml(seg + 1, 0);
      seg++;
      ch = 0;
      return;
    }

    ch++;
    overviewHtml.value = renderTypedHtml(seg, ch);

    if (ch >= item.value.length) {
      seg++;
      ch = 0;

      // ensure we commit the full segment
      overviewHtml.value = renderTypedHtml(seg, 0);

      if (seg >= overviewModel.length) {
        window.clearInterval(_timer);
        _timer = null;
        isTyping.value = false;
      }
    }
  }, 14); // speed (lower = faster)
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

watch(active, (v) => {
  if (v === "overview") startOverviewTyping();
  else {
    window.clearInterval(_timer);
    _timer = null;
    isTyping.value = false;
    overviewHtml.value = "";
  }
});

onMounted(() => {
  if (active.value === "overview") startOverviewTyping();
});

/* ===== Certs + stack ===== */
const certs = [
  {
    type: "Degree",
    title: "Bachelor of Science in Computer Science",
    org: "Dr. Yanga's Colleges, Inc.",
    date: "2021 — 2025",
    desc: "CS foundation: programming, databases, software engineering, and systems.",
    img: diplomaImg,
  },
  {
    type: "Certification",
    title: "Microsoft Office Specialist: Excel Associate (Excel 2019)",
    org: "Microsoft",
    date: "Jun 2023",
    desc: "Excel proficiency: formulas, worksheets, data handling, and productivity workflows.",
    img: mosCertImg,
    link:
      "https://www.certiport.com/portal/Pages/PrintTranscriptInfo.aspx?action=Cert&id=420&cvid=oAbpbliGFtAaoX/qwdyGYA==",
  },
  {
    type: "Course Completion",
    title: "Oracle Academy Database Foundations",
    org: "Oracle",
    date: "May 2023",
    desc: "Relational database fundamentals: SQL basics, data modeling, and core DB concepts.",
    img: oracleCertImg,
  },
  {
    type: "Course Completion",
    title: "Introduction to Cybersecurity",
    org: "Cisco",
    date: "Dec 2023",
    desc: "Cybersecurity basics: threats, security awareness, and safe practices.",
    img: ciscoCertImg,
    link:
      "https://www.credly.com/badges/74a0bed3-2a8d-41ff-8d81-755f2e6a3624/print",
  },
  {
    type: "Course Completion",
    title: "Introduction to C++",
    org: "Sololearn",
    date: "Feb 2026",
    desc: "C++ fundamentals: syntax, control flow, functions, and OOP basics.",
    img: soloCppIntroImg,
    link: "https://www.sololearn.com/certificates/CC-WG0KTGBF",
  },
  {
    type: "Course Completion",
    title: "C++ Intermediate",
    org: "Sololearn",
    date: "Feb 2026",
    desc: "Intermediate C++: deeper OOP, pointers, and more complex program structure.",
    img: soloCppInterImg,
    link: "https://www.sololearn.com/certificates/CC-K75MTO3W",
  },
];

/* ✅ Language tiers */
const langFamiliar = [
  { name: "Python", icon: pythonIcon },
  { name: "C++", icon: cppIcon },
];

const langWorking = [
  { name: "JavaScript", icon: jsIcon },
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
];

const langExposure = [
  { name: "C#", icon: csharpIcon },
  { name: "Java", icon: javaIcon },
  { name: "SQL", icon: sqlIcon },
];

const webStack = [
  { name: "Figma", icon: figmaIcon },
  { name: "Vue", icon: vueIcon },
  { name: "Vite", icon: viteIcon },
  { name: "Bootstrap", icon: bootstrapIcon },
  { name: "Supabase", icon: supabaseIcon },
  { name: "Vercel", icon: vercelIcon },
];

const gameStack = [
  { name: "Aseprite", icon: asepriteIcon },
  { name: "Unity", icon: unityIcon },
  { name: "WebGL", icon: webglIcon },
  { name: "itch.io", icon: itchIcon },
];

/* ✅ NEW: Additional tools (icons required) */
const additionalTools = [
  { name: "UiPath", icon: uipathIcon },
  { name: "Macro Recorder", icon: macroIcon },
  { name: "CapCut", icon: capcutIcon },
  { name: "Canva", icon: canvaIcon },
  { name: "VS Code", icon: vscodeIcon },
  { name: "ChatGPT", icon: chatgptIcon },
  { name: "Railway", icon: railwayIcon },
];

/* ===== preview modal state ===== */
const preview = ref(null);

function openPreview(c) {
  preview.value = c;
}
function closePreview() {
  preview.value = null;
}

function onKeydown(e) {
  if (e.key === "Escape" && preview.value) closePreview();
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
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

/* ===== Overview ===== */
.overviewWrap{
  position: relative;
  border-radius: 16px;
  padding: 14px 14px;
  background: rgba(0,0,0,.12);
  border: 1px solid rgba(255,255,255,.08);
  overflow: hidden;
}

.overviewFx{
  position: absolute;
  inset: -2px;
  background:
    radial-gradient(520px 240px at 20% 20%, rgba(183,140,255,.12), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.06), transparent 40%, rgba(0,0,0,.10));
  pointer-events: none;
  opacity: .9;
}

.aboutText{
  position: relative;
  margin: 0;
  font-family: var(--font-sans);
  color: rgba(255,255,255,.84);
  line-height: 1.78;
  max-width: 920px;
}

.aboutTextBig{
  font-size: 16px;
}

.aboutTextBig b{
  color: rgba(255,255,255,.96);
  font-weight: 900;
  text-shadow: 0 10px 24px rgba(0,0,0,.35);
}

.aboutCaret{
  display: inline-block;
  width: 10px;
  height: 1.05em;
  margin-left: 6px;
  transform: translateY(2px);
  background: rgba(183,140,255,.88);
  animation: caretBlink .9s steps(1) infinite;
  border-radius: 2px;
}

@keyframes caretBlink{
  50%{ opacity: 0; }
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

/* ===== Shared section head ===== */
.sectionHead{
  display:flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.sectionTitle{
  font-family: var(--font-tech);
  letter-spacing: 1.6px;
  font-weight: 900;
  font-size: 12px;
  color: rgba(255,255,255,.86);
}

.sectionHint{
  font-family: var(--font-sans);
  font-size: 12px;
  color: rgba(255,255,255,.55);
}

/* ===== Certifications (premium) ===== */
.certGrid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.certCard{
  border-radius: 18px;
  background:
    radial-gradient(420px 220px at 15% 0%, rgba(183,140,255,.10), transparent 60%),
    rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow:
    0 18px 45px rgba(0,0,0,.22),
    inset 0 1px 0 rgba(255,255,255,.06);
  padding: 12px;
  cursor: pointer;
  outline: none;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

.certCard:hover{
  transform: translateY(-3px);
  border-color: rgba(183,140,255,.22);
  box-shadow:
    0 26px 70px rgba(0,0,0,.30),
    0 0 22px rgba(183,140,255,.10),
    inset 0 1px 0 rgba(255,255,255,.07);
}

.certCard:focus-visible{
  border-color: rgba(183,140,255,.35);
  box-shadow:
    0 0 0 3px rgba(183,140,255,.10),
    0 26px 70px rgba(0,0,0,.30);
}

.certThumb{
  width: 100%;
  aspect-ratio: 16 / 6;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 10px;
  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.10);
  position: relative;
}

.certThumb img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: rgba(255,255,255,.06);
}

.certThumbFade{
  position:absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 65%, rgba(0,0,0,.28));
  pointer-events: none;
}

.certTop{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.certBadge{
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 1px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.10);
  color: rgba(255,255,255,.78);
}

.certDate{
  font-family: var(--font-sans);
  font-size: 12px;
  color: rgba(255,255,255,.58);
}

.certTitle{
  margin: 0 0 4px;
  font-family: var(--font-tech);
  letter-spacing: .8px;
  font-size: 14px;
  color: rgba(255,255,255,.92);
}

.certOrg{
  margin: 0 0 8px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: rgba(255,255,255,.62);
}

.certDesc{
  margin: 0;
  font-family: var(--font-sans);
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(255,255,255,.70);
}

.certFooter{
  margin-top: 12px;
  display:flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.certFooterRight{
  justify-content: flex-end;
}

.certLink{
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 1px;
  color: rgba(183,140,255,.86);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(183,140,255,.22);
  background: rgba(183,140,255,.06);
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}

.certLink:hover{
  transform: translateY(-1px);
  border-color: rgba(183,140,255,.34);
  background: rgba(183,140,255,.10);
}

.certLink.ghost{
  opacity: .55;
  border-style: dashed;
}

/* ===== Tech Stack ===== */
.stackBlock{
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.12);
}

.stackTitle{
  font-family: var(--font-tech);
  letter-spacing: 1.2px;
  font-weight: 900;
  font-size: 12px;
  color: rgba(255,255,255,.86);
  margin-bottom: 10px;
}

.stackRow{
  display:flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/* ✅ language grouping styles */
.stackGroup{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255,255,255,.10);
}

.stackGroup:first-child{
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.stackLabel{
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 1.2px;
  color: rgba(255,255,255,.70);
  margin: 0 0 8px;
}

.logoChip{
  width: 76px;
  height: 76px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  display:grid;
  place-items:center;
  gap: 6px;
  pointer-events: none;
  box-shadow:
    0 18px 45px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.06);
}

.logoImg{
  width: 44px;
  height: 44px;
  object-fit: contain;
  display:block;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.35));
}

.logoName{
  font-family: var(--font-tech);
  font-size: 9px;
  letter-spacing: .8px;
  color: rgba(255,255,255,.70);
  margin-top: -2px;
}

.stackFlow{
  margin-top: 10px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: rgba(255,255,255,.65);
}

/* ===== MODAL FIX ===== */
.certOverlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.62);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
  overflow: auto;
}

.certModal{
  width: min(980px, 96vw);
  max-height: calc(100vh - 36px);
  border-radius: 18px;
  background:
    radial-gradient(720px 380px at 50% 0%, rgba(183,140,255,.14), transparent 60%),
    linear-gradient(180deg, rgba(18,18,28,.92), rgba(10,10,18,.92));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 30px 95px rgba(0,0,0,.62);
  padding: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.certClose{
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  cursor: pointer;
  z-index: 3;
}

.certModalHead{
  padding: 6px 54px 10px 6px;
  position: sticky;
  top: 0;
  z-index: 2;
}

.certModalTitle{
  font-family: var(--font-tech);
  letter-spacing: 2px;
  font-size: 18px;
  color: rgba(255,255,255,.92);
}

.certModalSub{
  margin-top: 4px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: rgba(255,255,255,.62);
}

.certModalImgWrap{
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  overflow: auto;
  flex: 1;
  min-height: 240px;
}

.certModalImg{
  width: 100%;
  height: auto;
  display: block;
}

.certModalActions{
  margin-top: 12px;
  display:flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  z-index: 2;
  padding-top: 12px;
  background: linear-gradient(180deg, transparent, rgba(10,10,18,.92) 55%);
}

.certModalBtn{
  height: 38px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  font-family: var(--font-sans);
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  display: inline-grid;
  place-items: center;
}

.certModalBtn.primary{
  border-color: rgba(183,140,255,.26);
  background: rgba(183,140,255,.10);
}

/* mobile */
@media (max-width: 1100px){
  .aboutSimple{ padding: 12px 18px 0; }
  .aboutTop{ flex-direction: column; align-items: flex-start; }
  .certGrid{ grid-template-columns: 1fr; }
  .aboutTextBig{ font-size: 15px; }
}
</style>
