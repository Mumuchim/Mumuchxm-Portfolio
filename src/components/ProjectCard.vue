<template>
  <article class="card">
    <div class="thumb">
      <!-- If image exists -->
      <img
        v-if="img"
        :src="img"
        class="thumbImg"
        alt="project thumbnail"
      />

      <!-- If no image, show fake gradient -->
      <div v-else class="thumbFake"></div>
    </div>

    <div class="cardBody">
      <h3 class="cardTitle">{{ title }}</h3>
      <p class="cardDesc">{{ desc }}</p>

      <div class="cardFooter">
        <button class="viewBtn" :class="{ coming }">
          View <span class="arrow">→</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, default: null },
  coming: { type: Boolean, default: false },
});
</script>

<style scoped>
/* Card shell (self-contained, not relying on global) */
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
  transform: translateY(0) scale(1);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  will-change: transform;
}

.card:hover{
  z-index: 50;
  transform: translateY(-18px) scale(1.04);
  box-shadow: 0 26px 80px rgba(0,0,0,.65);
  border-color: rgba(183,140,255,.35);
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
  transition: transform .35s ease;
}

.card:hover .thumbImg{
  transform: scale(1.06);
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
/* Instead of calc(290px - 132px), we make a stable min-height */
.cardBody{
  padding: 14px 14px 16px;
  display:flex;
  flex-direction:column;
  min-height: 158px; /* roughly what your old calc produced */
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

.cardFooter{
  display:flex;
  justify-content:flex-end;
  margin-top: 10px;
}

.viewBtn{
  min-width: 100px;
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;

  background: linear-gradient(135deg, var(--purple), #8c6cff);
  border: 1px solid rgba(255,255,255,.15);

  color: white;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .6px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  cursor: pointer;
  transition: transform .25s cubic-bezier(.4,.0,.2,1), box-shadow .25s ease, opacity .25s ease;
  box-shadow: 0 6px 20px rgba(108,74,168,.35);
}

.viewBtn:hover{
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(108,74,168,.55);
}

.viewBtn:active{
  transform: translateY(0);
}

.arrow{
  transition: transform .25s ease;
}

.viewBtn:hover .arrow{
  transform: translateX(4px);
}

/* Optional: Coming soon state (you already have prop, now it does something) */
.viewBtn.coming{
  opacity: .65;
  cursor: not-allowed;
  filter: saturate(.8);
}

.viewBtn.coming:hover{
  transform: none;
  box-shadow: 0 6px 20px rgba(108,74,168,.35);
}
</style>
