import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { authStore } from './auth.store';
import { errorStore } from './error.store';

const MODULES = {
  'auth': authStore,
  'error': errorStore
};

export interface AppState { }

Vue.use(Vuex);

export default new Vuex.Store<AppState>({
  state: {},
  modules: { ...MODULES }
})