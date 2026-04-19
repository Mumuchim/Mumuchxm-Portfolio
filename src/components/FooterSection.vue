<template>
  <footer class="footer">
    <div class="footerDivider"></div>

    <div class="footerMain">
      <!-- Name + tagline -->
      <div class="footerTop">
        <span class="footerBrand">Mumuchxm</span>
        <span class="footerPipe">|</span>
        <span class="footerFull">Jerome Isaac Cereneo</span>
        <span class="footerPipe">|</span>
        <span class="footerTagline">Web & Game Developer · Philippines</span>
        <div class="footerAvail">
          <span class="footerAvailDot"></span>
          Fulltime
        </div>
      </div>

      <!-- Nav links row -->
      <nav class="footerNav">
        <a v-for="link in navLinks" :key="link.href"
           :href="link.href" class="footerNavLink"
           @click.prevent="scrollTo(link.href)">
          {{ link.label }}
        </a>
      </nav>

      <!-- Divider -->
      <div class="footerMidLine"></div>

      <!-- Bottom row -->
      <div class="footerBottom">
        <div class="footerSocials">
          <a href="https://github.com/Mumuchim" target="_blank" rel="noopener noreferrer"
             class="footerSocialBtn" aria-label="GitHub">
            <img :src="githubIcon" alt="GitHub" />
            GitHub
          </a>
          <span class="footerPipe">|</span>
          <a href="https://www.linkedin.com/in/jerome-isaac-cereneo" target="_blank" rel="noopener noreferrer"
             class="footerSocialBtn" aria-label="LinkedIn">
            <img :src="linkedinIcon" alt="LinkedIn" />
            LinkedIn
          </a>
          <span class="footerPipe">|</span>
          <a href="https://discord.com/users/532450436863492097" target="_blank" rel="noopener noreferrer"
             class="footerSocialBtn" aria-label="Discord">
            <img :src="discordIcon" alt="Discord" />
            Discord
          </a>
          <span class="footerPipe">|</span>
          <a href="mailto:cereneo.jeromeisaac@gmail.com" class="footerSocialBtn">
            ✉ cereneo.jeromeisaac@gmail.com
          </a>
        </div>
        <span class="footerCopy">© {{ year }} Jerome Isaac Cereneo</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import githubIcon   from '../assets/github.png';
import linkedinIcon from '../assets/linkedin.png';
import discordIcon  from '../assets/discord.png';

const year = new Date().getFullYear();

const navLinks = [
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Extras',     href: '#extra'      },
];

function scrollTo(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  margin-top: 48px;
}

.footerDivider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(183,140,255,.15) 15%,
    rgba(183,140,255,.50) 50%,
    rgba(183,140,255,.15) 85%,
    transparent 100%
  );
}

.footerMain {
  padding: 28px clamp(20px, 4vw, 52px) 24px;
  background: rgba(8, 6, 18, 0.70);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Top row ── */
.footerTop {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footerBrand {
  font-family: Orbitron, sans-serif;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--accent);
}

.footerFull {
  font-family: Orbitron, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .8px;
  color: rgba(255,255,255,.55);
}

.footerTagline {
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  color: rgba(255,255,255,.35);
}

.footerPipe {
  color: rgba(183,140,255,.30);
  font-size: 12px;
  user-select: none;
}

.footerAvail {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border-radius: 999px;
  background: rgba(34,197,94,.08);
  border: 1px solid rgba(34,197,94,.22);
  font-family: Montserrat, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #6ee89e;
  letter-spacing: .3px;
  margin-left: 4px;
}

.footerAvailDot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,.55); }
  60%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
}

/* ── Nav ── */
.footerNav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
}

.footerNavLink {
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,.45);
  text-decoration: none;
  padding: 0 14px;
  border-right: 1px solid rgba(255,255,255,.12);
  transition: color .18s ease;
  line-height: 1;
}

.footerNavLink:first-child { padding-left: 0; }
.footerNavLink:last-child  { border-right: none; }

.footerNavLink:hover { color: var(--accent); }

/* ── Mid divider ── */
.footerMidLine {
  height: 1px;
  background: rgba(255,255,255,.06);
}

/* ── Bottom row ── */
.footerBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footerSocials {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.footerSocialBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: Montserrat, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255,255,255,.38);
  text-decoration: none;
  transition: color .18s ease;
}

.footerSocialBtn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 3px;
  opacity: 0.7;
  transition: opacity .18s ease;
}

.footerSocialBtn:hover {
  color: rgba(255,255,255,.80);
}

.footerSocialBtn:hover img { opacity: 1; }

.footerCopy {
  font-family: Orbitron, sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .6px;
  color: rgba(255,255,255,.20);
}

@media (max-width: 600px) {
  .footerBottom { flex-direction: column; align-items: flex-start; }
  .footerTop    { gap: 8px; }
}
</style>
