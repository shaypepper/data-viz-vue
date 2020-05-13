import Vue from "vue";
import App from "./App.vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

Vue.config.productionTip = false;
Vue.use(gsap);
gsap.registerPlugin(Draggable);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
