import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { default as Axios, AxiosResponse } from "axios";

import { AppState } from './app.store';
import { apiPath } from '../router';

export interface AuthState {
  token: string | null;
  user: User;
}

export interface User {
  id: number,
  email: string
}

export const AuthStore: Module<AuthState, AppState> = {
  namespaced: true,
  state: <AuthState>{
    token: null,
    user: null
  },
  mutations: <MutationTree<AuthState>>{
    setToken: (state, payload: string) => {
      state.token = payload;
    },
    setUser: (state, payload: User) => {
      state.user = payload;
    }
  },
  actions: <ActionTree<AuthState, AppState>>{
    login: ({ commit }, payload: { email: string, password: string }) => {
      Axios.post(`${apiPath}/auth/login`, payload).then((response: AxiosResponse) => {
        commit('setToken', response.data.token);
        commit('setUser', response.data.user);
      });
    }
  },
  getters: <GetterTree<AuthState, AppState>>{
    token: (state): string => {
      return state.token;
    },
    user: (state): User => {
      return state.user;
    }
  }
}