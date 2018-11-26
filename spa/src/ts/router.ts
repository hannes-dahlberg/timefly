import VueRouter from 'vue-router';

import { LoginComponent } from './components/'

export const apiRoot: string = `http://${process.env.API_HOST}:${process.env.PORT}`;

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: LoginComponent }
  ]
});