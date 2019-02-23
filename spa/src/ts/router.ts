import Vue from "vue";
import VueRouter from "vue-router";

import { default as middlewares, guard } from "./middlewares";

import { ErrorComponent, LoginComponent, TimerComponent } from "./components/";

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/error/:code", name: "error", component: ErrorComponent, beforeEnter: guard([middlewares.errorCode]) },
    { path: "/login", name: "login", component: LoginComponent, beforeEnter: guard([middlewares.guest]) },
    { path: "/logout", name: "logout", beforeEnter: guard([middlewares.auth, middlewares.logout]) },
    { path: "/start", name: "start", component: TimerComponent, beforeEnter: guard([middlewares.auth]) },
    { path: "/timer", name: "timer", component: TimerComponent, beforeEnter: guard([middlewares.auth]) },
    { path: "/reports", name: "reports", component: TimerComponent, beforeEnter: guard([middlewares.auth]) },
    { path: "/clients", name: "clients", component: TimerComponent, beforeEnter: guard([middlewares.auth]) },
    { path: "*", beforeEnter: guard([middlewares.invalidRoute]) },
  ],
});
