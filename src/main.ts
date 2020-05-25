import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Home from "./components/Home/index.vue";
import ExploratoryProject from "./components/ExploratoryProject/index.vue";
import ExplanatoryProject from "./components/ExplanatoryProject/Scroller.vue";
import WorkingWithData from "./components/WorkingWithData/index.vue";
import { gsap } from "gsap";

Vue.config.productionTip = false;
Vue.use(gsap);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/bill", component: ExploratoryProject },
    { path: "/upshot", component: ExplanatoryProject },
    { path: "/verbs", component: WorkingWithData },
  ],
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
