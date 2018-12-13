import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { authStore } from "./auth.store";
import { errorStore } from "./error.store";
import { timerStore } from "./timer.store";

const MODULES = {
  auth: authStore,
  error: errorStore,
  timer: timerStore,
};

export interface IAppState { }

Vue.use(Vuex);

export default new Vuex.Store<IAppState>({
  modules: { ...MODULES },
  plugins: [createPersistedState()],
  state: {},
});
