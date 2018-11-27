import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { AuthStore } from './auth.store';

const MODULES = {
  AuthStore
};

export interface AppState { }

Vue.use(Vuex);

export default new Vuex.Store<AppState>({
  state: {},
  modules: { ...MODULES }
})