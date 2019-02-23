import * as bootstrap from "bootstrap";
import $ from "jquery";
import popper from "popper.js";
(window as any).$ = $;
(window as any).popper = popper;
(window as any).bootstrap = bootstrap;

// VueJS
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";

Vue.use(VueRouter);
Vue.use(VueI18n);

// Index component
import { IndexComponent } from "./components/";

// Directives
import inputFocusDirective from "./directives/input-focus.directive";
import navbarFoldDirective from "./directives/navbar-fold.directive";
import parallaxDirective from "./directives/parallax.directive";
import tooltipDirective from "./directives/tooltip.directive";

Vue.directive("inputFocus", inputFocusDirective);
Vue.directive("navbarFold", navbarFoldDirective);
Vue.directive("parallax", parallaxDirective);
Vue.directive("tooltip", tooltipDirective);

import loading from "./utils/loading/loading.plugin";
import modal from "./utils/modal/modal.plugin";

Vue.use(loading);
Vue.use(modal);

// Router and store
import router from "./router";
import { appStore as store } from "./store";

import { i18n } from "./locale";

export const vue = new Vue({
  el: "#app",
  // store,
  render: (h) => h(IndexComponent),
  router,
  store,
  i18n,
});
