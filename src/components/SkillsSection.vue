<template>
  <section :id="id" class="stackSection">

    <div class="stackHeader">
      <h2 class="stackTitle">TECH STACK</h2>
      <p class="stackSub">Tools, languages &amp; technologies I work with</p>
    </div>

    <!-- Row 1: scrolls left -->
    <div class="marqueeWrapper">
      <div class="fadeLeft"></div>
      <div class="fadeRight"></div>
      <div class="marqueeTrack trackLeft">
        <div class="marqueeInner" v-for="_ in 2" :key="_">
          <div class="stackItem" v-for="item in row1" :key="item.name + _">
            <div class="stackIcon">
              <img :src="item.img" :alt="item.name" loading="lazy" />
            </div>
            <span class="stackLabel">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: scrolls right -->
    <div class="marqueeWrapper" style="margin-top: 18px;">
      <div class="fadeLeft"></div>
      <div class="fadeRight"></div>
      <div class="marqueeTrack trackRight">
        <div class="marqueeInner" v-for="_ in 2" :key="_">
          <div class="stackItem" v-for="item in row2" :key="item.name + _">
            <div class="stackIcon">
              <img :src="item.img" :alt="item.name" loading="lazy" />
            </div>
            <span class="stackLabel">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import imgHtml        from '../assets/stack/html.png';
import imgCss         from '../assets/stack/css.png';
import imgJs          from '../assets/stack/javascript.png';
import imgVue         from '../assets/stack/vue.png';
import imgReact       from '../assets/stack/reactjs.png';
import imgBootstrap   from '../assets/stack/bootstrap.png';
import imgVite        from '../assets/stack/vite.png';
import imgPython      from '../assets/stack/python.png';
import imgCpp         from '../assets/stack/cpp.png';
import imgCsharp      from '../assets/stack/csharp.png';
import imgJava        from '../assets/stack/java.png';
import imgSql         from '../assets/stack/sql.png';
import imgSupabase    from '../assets/stack/supabase.png';
import imgGithub      from '../assets/stack/github.png';
import imgVscode      from '../assets/stack/vscode.png';
import imgFigma       from '../assets/stack/figma.png';
import imgCanva       from '../assets/stack/canva.png';
import imgCapcut      from '../assets/stack/capcut.png';
import imgUnity       from '../assets/stack/unity.png';
import imgWebgl       from '../assets/stack/webgl.png';
import imgAseprite    from '../assets/stack/aseprite.png';
import imgUipath      from '../assets/stack/uipath.png';
import imgMacro       from '../assets/stack/macro.png';
import imgRailway     from '../assets/stack/railway.png';
import imgVercel      from '../assets/stack/vercel.png';
import imgItch        from '../assets/stack/itch.png';
import imgClaude      from '../assets/stack/claude.png';
import imgChatgpt     from '../assets/stack/chatgpt.png';
import imgDiscord     from '../assets/stack/discord.png';

defineProps({ id: { type: String, default: 'skills' } });

const row1 = [
  { name: 'HTML',        img: imgHtml },
  { name: 'CSS',         img: imgCss },
  { name: 'JavaScript',  img: imgJs },
  { name: 'Vue.js',      img: imgVue },
  { name: 'React',       img: imgReact },
  { name: 'Bootstrap',   img: imgBootstrap },
  { name: 'Vite',        img: imgVite },
  { name: 'Python',      img: imgPython },
  { name: 'C++',         img: imgCpp },
  { name: 'C#',          img: imgCsharp },
  { name: 'Java',        img: imgJava },
  { name: 'SQL',         img: imgSql },
  { name: 'Supabase',    img: imgSupabase },
  { name: 'GitHub',      img: imgGithub },
  { name: 'VS Code',     img: imgVscode },
];

const row2 = [
  { name: 'Figma',       img: imgFigma },
  { name: 'Canva',       img: imgCanva },
  { name: 'CapCut',      img: imgCapcut },
  { name: 'Unity',       img: imgUnity },
  { name: 'WebGL',       img: imgWebgl },
  { name: 'Aseprite',    img: imgAseprite },
  { name: 'UiPath',      img: imgUipath },
  { name: 'Macro',       img: imgMacro },
  { name: 'Railway',     img: imgRailway },
  { name: 'Vercel',      img: imgVercel },
  { name: 'Itch.io',     img: imgItch },
  { name: 'Claude AI',   img: imgClaude },
  { name: 'ChatGPT',     img: imgChatgpt },
  { name: 'Discord',     img: imgDiscord },
];
</script>

<style scoped>
.stackSection {
  padding: clamp(40px, 6vw, 72px) clamp(16px, 4vw, 48px);
}

.stackHeader {
  text-align: center;
  margin-bottom: 40px;
}

.stackTitle {
  font-family: var(--font-tech, 'Orbitron', sans-serif);
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 900;
  letter-spacing: 4px;
  color: #fff;
  margin: 0 0 10px;
}

.stackSub {
  font-size: 13px;
  color: rgba(255,255,255,.5);
  margin: 0;
  letter-spacing: .5px;
}

/* ── Marquee wrapper ── */
.marqueeWrapper {
  position: relative;
  overflow: hidden;
}

/* Fade edges */
.fadeLeft,
.fadeRight {
  position: absolute;
  top: 0; bottom: 0;
  width: 80px;
  z-index: 2;
  pointer-events: none;
}
.fadeLeft  { left: 0;  background: linear-gradient(to right, rgba(15,15,20,1) 0%, transparent 100%); }
.fadeRight { right: 0; background: linear-gradient(to left,  rgba(15,15,20,1) 0%, transparent 100%); }

/* Track */
.marqueeTrack {
  display: flex;
  width: max-content;
}

.trackLeft  { animation: scrollLeft  35s linear infinite; }
.trackRight { animation: scrollRight 35s linear infinite; }

.marqueeTrack:hover { animation-play-state: paused; }

@keyframes scrollLeft {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes scrollRight {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* Inner row (duplicated) */
.marqueeInner {
  display: flex;
  gap: 12px;
  padding: 4px 6px;
  flex-shrink: 0;
}

/* Each item */
.stackItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(255,255,255,.03);
  min-width: 90px;
  cursor: default;
  transition: border-color .25s ease, background .25s ease, transform .25s ease, box-shadow .25s ease;
}

.stackItem:hover {
  border-color: rgba(183,140,255,.35);
  background: rgba(183,140,255,.08);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.3), 0 0 18px rgba(183,140,255,.15);
}

.stackIcon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stackIcon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(.85) saturate(.9);
  transition: filter .25s ease;
}

.stackItem:hover .stackIcon img {
  filter: brightness(1.1) saturate(1.1) drop-shadow(0 0 6px rgba(183,140,255,.4));
}

.stackLabel {
  font-family: var(--font-tech, 'Orbitron', sans-serif);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(255,255,255,.55);
  text-align: center;
  transition: color .25s;
  white-space: nowrap;
}

.stackItem:hover .stackLabel {
  color: rgba(183,140,255,.9);
}
</style>
