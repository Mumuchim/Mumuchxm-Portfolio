<template>
  <section :id="id">
    <section class="heroRow">
      <div class="portrait">
        <div class="portraitGlow"></div>

        <div
          class="portraitInner"
          :style="{ backgroundImage: `url(${avatarImg})` }"
        ></div>
      </div>

      <div class="heroPanel">
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

          <button class="hireBtn">
            WANNA HIRE ME?
            <span class="hireSub">(please click this)</span>
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "home" },
  avatarImg: { type: String, required: true },
  typedText: { type: String, default: "" },
});
</script>
