<template>
  <section :id="id" class="tabSection">
    <div class="tabPlaceholder">
      <h2 class="tabTitle">CONTACT</h2>

      <p class="tabDesc">
        Let’s connect! I’m open to opportunities and collaborations.
      </p>

      <div class="contactGrid">
        <a class="contactItem" href="mailto:cereneo.jeromeisaac@gmail.com">
          cereneo.jeromeisaac@gmail.com
        </a>
        <div class="contactItem">Metro Manila, PH</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "contact" },
});
</script>

<style scoped>
.contactGrid {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.contactItem {
  text-decoration: none;
}
</style>
