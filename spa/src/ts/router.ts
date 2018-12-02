import VueRouter from 'vue-router';

import { default as middlewares, guard } from './middlewares';

import { LoginComponent, TimerComponent, ErrorComponent } from './components/'

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}`;

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/error/:code', component: ErrorComponent, beforeEnter: guard([middlewares.errorCode]) },
    { path: '/login', component: LoginComponent, beforeEnter: guard([middlewares.guest]) },
    { path: '/timer', component: TimerComponent, beforeEnter: guard([middlewares.auth]) }
  ]
});