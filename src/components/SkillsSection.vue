<template>
  <section :id="id" class="tabSection">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">ADDITIONAL SKILLS SHOWCASE</h2>

      <p class="tabSubtitle">
        Additional creative and practical skills beyond programming.
      </p>

      <!-- Gallery Grid -->
      <div class="galleryGrid">
        <!-- Pixel Art Card -->
        <article class="galleryCard empty">
          <div class="comingSoonOverlay">
            <span class="comingSoonIcon">&#x1F6A7;</span>
            <span class="comingSoonLabel">Coming Soon</span>
          </div>
          <div class="mediaWrapper">
            <img
              src="https://via.placeholder.com/800x600?text=Pixel+Art+Sample"
              alt="Pixel art sample"
              loading="lazy"
            />
          </div>
          <div class="cardBody">
            <h3>Pixel Art Practice</h3>
            <p>Created using Aseprite. Focus on character sprites and environment tiles.</p>
          </div>
        </article>

        <!-- Sprite Sheet Card -->
        <article class="galleryCard empty">
          <div class="comingSoonOverlay">
            <span class="comingSoonIcon">&#x1F6A7;</span>
            <span class="comingSoonLabel">Coming Soon</span>
          </div>
          <div class="mediaWrapper">
            <img
              src="https://via.placeholder.com/800x600?text=Sprite+Sheet"
              alt="Sprite sheet sample"
              loading="lazy"
            />
          </div>
          <div class="cardBody">
            <h3>Sprite Sheet</h3>
            <p>Basic animation frames and character movement practice.</p>
          </div>
        </article>

        <!-- Video Editing Card -->
        <article class="galleryCard empty">
          <div class="comingSoonOverlay">
            <span class="comingSoonIcon">&#x1F6A7;</span>
            <span class="comingSoonLabel">Coming Soon</span>
          </div>
          <div class="mediaWrapper">
            <iframe
              class="ytFrame"
              src="https://www.youtube.com/embed/Ynm7IWdTTFI?autoplay=1&mute=1&playsinline=1&loop=1&playlist=Ynm7IWdTTFI"
              title="Editing Demo"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <div class="cardBody">
            <h3>Editing Demo</h3>
            <p>Sample video editing work including cuts, captions, and transitions.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "skills" },
});
</script>

<style scoped>
.tabSubtitle {
  margin-top: 8px;
  opacity: 0.8;
  font-size: 15px;
}

.galleryGrid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.galleryCard {
  background: rgba(18,18,26,0.92);
  border-radius: 14px;
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 18px 40px rgba(0,0,0,.22);
  position: relative;
}

.galleryCard:hover {
  transform: translateY(-6px);
  border-color: rgba(183,140,255,.22);
  box-shadow: 0 26px 70px rgba(0,0,0,.34);
}

/* Dimmed empty state */
.galleryCard.empty {
  opacity: 0.42;
  filter: grayscale(0.45);
  pointer-events: none;
}

/* Coming Soon Overlay */
.comingSoonOverlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(10, 10, 18, 0.55);
  backdrop-filter: blur(4px);
  border-radius: 14px;
  pointer-events: none;
}

.comingSoonIcon {
  font-size: 30px;
  line-height: 1;
}

.comingSoonLabel {
  font-family: Orbitron, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.80);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.18);
  padding: 5px 14px;
  border-radius: 20px;
}

.mediaWrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: rgba(0,0,0,.22);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mediaWrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ytFrame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.cardBody {
  padding: 16px;
}

.cardBody h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-family: var(--font-tech, inherit);
  letter-spacing: .6px;
}

.cardBody p {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.5;
}
</style>
