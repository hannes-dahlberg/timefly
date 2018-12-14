import { AxiosResponse, default as Axios } from "axios";
import moment from "moment";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState } from "./app.store";
import { IErrorPayload } from "./error.store";

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}`;

export interface ITimerState {
  token: string | null;
}

export interface ITimer {
  id: number;
}

export type indexActionCallback = (date: Date) => Promise<ITimer[]>;

export const timerStore: Module<ITimerState, IAppState> = {
  actions: {
    index: ({ commit, dispatch }, date: Date): Promise<ITimer[]> => {
      return new Promise((resolve, reject) => {
        Axios.get(`${apiPath}/timer`, { params: { date: moment(date).format("YYYY-MM-DD") } }).then((response: AxiosResponse) => {
          resolve(response.data);
        });
      });
    },
  } as ActionTree<ITimerState, IAppState>,
  namespaced: true,
  state: {
    token: null,
    user: null,
  } as ITimerState,
};
