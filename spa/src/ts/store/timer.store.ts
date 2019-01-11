import { default as Axios } from "axios";
import { ActionTree, Module } from "vuex";
import { IAppState } from "./app.store";
import { IStartTimerJSON, IEndTimerJSON } from "../../../../shared/dto";

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}/timer`;

export type timerStartAction = (startTimer: IStartTimerJSON) => Promise<void>;
export type timerEndAction = (startTimer: IEndTimerJSON) => Promise<void>;
export interface ITimerState {

}

export const timerStore: Module<ITimerState, IAppState> = {
  namespaced: true,
  actions: {
    start: ({ dispatch }, startTimer: IStartTimerJSON): Promise<void> => new Promise((resolve, reject) => {
      Axios.post(`${apiPath}/start`, startTimer).then(() => resolve()).catch((error: any) => dispatch("error/submit", { code: 500, message: "Error while starting timer", error }));
    }),
    stop: ({ dispatch }, endTimer: IEndTimerJSON): Promise<void> => new Promise((resolve, reject) => {
      Axios.put(`${apiPath}/${endTimer.id}/stop`, endTimer).then(() => resolve()).catch((error: any) => dispatch("error/submit", { code: 500, message: "Error while stopping timer", error }));
    })
  } as ActionTree<ITimerState, IAppState>,
  state: {
    token: null,
    user: null,
  } as ITimerState,
};
