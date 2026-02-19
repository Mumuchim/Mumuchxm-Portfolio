<template>
  <section :id="id">
    <section class="heroRow">
      <!-- ===== LEFT: AVATAR ===== -->
      <div class="portrait">
        <div class="portraitGlow"></div>

        <div
          class="portraitInner"
          :style="{ backgroundImage: `url(${avatarImg})` }"
        ></div>
      </div>

      <!-- ===== RIGHT: PANEL ===== -->
      <div class="heroPanel">

        <!-- ===== SOCIAL BUTTONS ===== -->
        <div class="heroSocials" aria-label="Social links">

          <a
            class="socialBtn gh"
            href="https://github.com/Mumuchim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img :src="githubIcon" alt="GitHub" />
          </a>

          <a
            class="socialBtn in"
            href="https://www.linkedin.com/in/jerome-isaac-cereneo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img :src="linkedinIcon" alt="LinkedIn" />
          </a>

          <a
            class="socialBtn dc"
            href="https://discord.com/users/532450436863492097"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <img :src="discordIcon" alt="Discord" />
          </a>

        </div>

        <!-- ===== HERO TEXT ===== -->
        <div class="heroPanelInner">
          <div class="heroHeading">
            <h1 class="heroTitle">JEROME ISAAC CERENEO</h1>
            <p class="heroLocation">based in Philippines.</p>
          </div>

          <h3 class="typingText">
            I can do
            <span class="typingWord">{{ typedText }}</span>
            <span class="caret"></span>
          </h3>

          <button class="hireBtn" type="button" @click="openContact">
            CONTACT ME <br>
          </button>
        </div>

      </div>
    </section>

    <!-- ===== CONTACT MODAL ===== -->
    <teleport to="body">
      <div
        v-if="showContact"
        class="contactOverlay"
        @click.self="closeContact"
      >
        <div class="contactCard">
          <!-- ✅ CENTERED TITLE (no close button now) -->
          <div class="contactHeader">
            <h3 class="contactTitle">CONTACT</h3>
            <p class="contactSub">Reach me here:</p>
          </div>

          <div class="contactGrid">

            <div class="contactItem">
              <div class="contactMeta">
                <div class="contactLabel">EMAIL</div>
                <div class="contactValue">{{ email }}</div>
              </div>

              <button
                class="contactBtn"
                :class="{ copied: copiedKey === 'email' }"
                @click="copy(email, 'email')"
              >
                {{ copiedKey === 'email' ? 'COPIED' : 'COPY' }}
              </button>
            </div>

            <div class="contactItem">
              <div class="contactMeta">
                <div class="contactLabel">PHONE</div>
                <div class="contactValue">{{ phone }}</div>
              </div>

              <button
                class="contactBtn"
                :class="{ copied: copiedKey === 'phone' }"
                @click="copy(phone, 'phone')"
              >
                {{ copiedKey === 'phone' ? 'COPIED' : 'COPY' }}
              </button>
            </div>

          </div>

          <!-- ✅ OK moved bottom-center and wider -->
          <div class="contactActions">
            <button class="contactBtn primary okWide" @click="closeContact">
              OK
            </button>
          </div>

        </div>
      </div>
    </teleport>

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import discordIcon from "../assets/discord.png";

defineProps({
  id: { type: String, default: "home" },
  avatarImg: { type: String, required: true },
  typedText: { type: String, default: "" },
});

const email = "cereneo.jeromeisaac@gmail.com";
const phone = "+63 906 025 3843";

const showContact = ref(false);
const copiedKey = ref(""); // "email" | "phone" | ""

function openContact() {
  showContact.value = true;
}

function closeContact() {
  showContact.value = false;
  copiedKey.value = "";
  window.clearTimeout(copy._t);
}

async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback: still show copied state even if clipboard fails
  }

  copiedKey.value = key;
  window.clearTimeout(copy._t);
  copy._t = window.setTimeout(() => (copiedKey.value = ""), 1400);
}

function onKeydown(e) {
  if (e.key === "Escape" && showContact.value) closeContact();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>

/* ===== PANEL ===== */
.heroPanel{ position: relative; }

/* ===== SOCIALS ===== */
.heroSocials{
  position: absolute;
  right: 56px;
  top: 71%;
  transform: translateY(-50%);
  display: flex;
  gap: 14px;
  z-index: 20;
}

.socialBtn{
  width: 72px;
  height: 72px;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  background: transparent;
  display: grid;
  place-items: center;
  transition: transform .25s ease, box-shadow .25s ease;
}

.socialBtn img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.socialBtn.dc{ border-radius: 50%; }
.socialBtn:hover{ transform: translateY(-2px) scale(1.02); }

.socialBtn.gh:hover{
  box-shadow: 0 6px 16px rgba(0,0,0,.35), 0 0 14px rgba(255,255,255,.25);
}
.socialBtn.in:hover{
  box-shadow: 0 6px 16px rgba(0,0,0,.35), 0 0 14px rgba(79, 163, 246, 0.656);
}
.socialBtn.dc:hover{
  box-shadow: 0 6px 16px rgba(0,0,0,.35), 0 0 16px rgba(119, 123, 235, 0.608);
}

/* ===== MOBILE ===== */
@media (max-width: 1100px){
  .heroSocials{
    position: static;
    transform: none;
    justify-content: center;
    margin-top: 14px;
  }
}

/* ===== CONTACT MODAL ===== */

.contactOverlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.58);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;

  font-family: var(--font-body, 'Roboto', sans-serif);
}

.contactCard{
  width: min(720px, 95vw);
  border-radius: 18px;

  background:
    radial-gradient(560px 280px at 50% 0%, rgba(168,140,255,.14), transparent 62%),
    linear-gradient(180deg, rgba(18,18,28,.92), rgba(10,10,18,.92));

  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 30px 95px rgba(0,0,0,.62);

  padding: 18px;
  position: relative;
}

.contactHeader{
  text-align: center;
  padding: 4px 10px 10px;
}

.contactTitle{
  margin: 2px 0 6px;
  font-family: var(--font-tech, 'Orbitron', sans-serif);
  letter-spacing: 3px;
  font-size: 24px;
}

.contactSub{
  margin: 0;
  color: rgba(255,255,255,.70);
  font-size: 13px;
}

.contactGrid{ display: grid; gap: 12px; margin-top: 8px; }

.contactItem{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  padding: 14px 14px;
  border-radius: 16px;

  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.10);
}

.contactLabel{
  font-family: var(--font-tech, 'Orbitron', sans-serif);
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(255,255,255,.62);
  margin-bottom: 4px;
}

.contactValue{
  font-weight: 900;
  color: rgba(255,255,255,.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contactBtn{
  height: 38px;
  padding: 0 16px;
  border-radius: 14px;

  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);

  font-family: var(--font-body, 'Roboto', sans-serif);
  font-weight: 900;
  letter-spacing: .6px;

  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
}

.contactBtn:hover{
  transform: translateY(-1px);
  border-color: rgba(168,140,255,.35);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), 0 0 16px rgba(168,140,255,.18);
  background: rgba(255,255,255,.08);
}

.contactBtn:active{ transform: translateY(0); }

.contactBtn.copied{
  border-color: rgba(34,197,94,.55);
  background: rgba(34,197,94,.12);
  color: rgba(220,255,235,.95);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), 0 0 16px rgba(34,197,94,.16);
}

.contactBtn.primary{
  border-color: rgba(168,140,255,.35);
  background: rgba(168,140,255,.10);
}

/* ✅ Bottom-center actions */
.contactActions{
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* ✅ Wide OK button */
.okWide{
  width: min(150px, 92%);
  height: 44px;
  border-radius: 16px;
  font-size: 14px;
}

</style>
