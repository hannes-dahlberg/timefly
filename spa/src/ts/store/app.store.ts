import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { authStore } from "./auth.store";
import { clientStore } from "./client.store";
import { errorStore } from "./error.store";
import { reportStore } from "./report.store";
import { timerStore } from "./timer.store";

const MODULES = {
  auth: authStore,
  client: clientStore,
  error: errorStore,
  report: reportStore,
  timer: timerStore,
};

export interface IAppState { } // tslint:disable-line:no-empty-interface

Vue.use(Vuex);

export const appStore = new Vuex.Store<IAppState>({
  modules: { ...MODULES },
  plugins: [createPersistedState()],
  state: {},
});
