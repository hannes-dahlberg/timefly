// VueJS
import Vue from 'vue'
import VueRouter from 'vue-router';



// Index component
import { IndexComponent } from './components/';

Vue.use(VueRouter);

// Router and store
import router from './router';
import { appStore as store } from './store'

new Vue({
  el: '#app',
  //store,
  render: h => h(IndexComponent),
  router,
  store
});