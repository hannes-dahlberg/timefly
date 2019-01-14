import VueRouter from "vue-router";

import { default as middlewares, guard } from "./middlewares";

import { ErrorComponent, LoginComponent, TimerComponent } from "./components/";

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}`;

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/error/:code", name: "error", component: ErrorComponent, beforeEnter: guard([middlewares.errorCode]) },
    { path: "/login", name: "login", component: LoginComponent, beforeEnter: guard([middlewares.guest]) },
    { path: "/timer", name: "timer", component: TimerComponent, beforeEnter: guard([middlewares.auth]) },
    { path: "*", beforeEnter: guard([middlewares.invalidRoute]) },
  ],
});
