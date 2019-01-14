import * as bootstrap from "bootstrap";
import $ from "jquery";
import popper from "popper.js";
(window as any).$ = $;
(window as any).popper = popper;
(window as any).bootstrap = bootstrap;

// VueJS
import Vue from "vue";
import VueRouter from "vue-router";

// Index component
import { IndexComponent } from "./components/";

Vue.use(VueRouter);

// Router and store
import router from "./router";
import { appStore as store } from "./store";

const vue = new Vue({
  el: "#app",
  // store,
  render: (h) => h(IndexComponent),
  router,
  store,
});
