<template>
  <section :id="id" class="tabSection">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">SKILLS</h2>

      <ul class="skillList">
        <li><b>Programming:</b> C++, Python</li>
        <li><b>Web:</b> Vue + Vite (learning), HTML/CSS</li>
        <li><b>Creative:</b> Pixel Art (practice), Photo/Video Editing</li>
        <li><b>Tools:</b> Git/GitHub basics, Figma basics</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "skills" },
});
</script>

<style scoped>
.skillList {
  margin: 18px 0 0;
  padding-left: 18px;
  line-height: 1.8;
}
</style>
