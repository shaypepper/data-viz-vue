import Vue from "vue";
import App from "./App.vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import VueScrollmagic from "vue-scrollmagic";

Vue.config.productionTip = false;
Vue.use(gsap);
Vue.use(VueScrollmagic);
gsap.registerPlugin(Draggable);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
