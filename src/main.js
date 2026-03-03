import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";

const app = createApp(App);

// v-reveal: adds 'visible' class when element enters the viewport
app.directive("reveal", {
  mounted(el, binding) {
    const delay = binding.value?.delay ?? 0;
    el.style.transitionDelay = delay ? `${delay}ms` : "";
    el.classList.add("reveal");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
  },
});

app.mount("#app");
