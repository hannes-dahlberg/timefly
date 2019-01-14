import { default as Axios } from "axios";
import { ActionTree, Module } from "vuex";
import { EndTimerDTO, StartTimerDTO } from "../../../../shared/dto";
import { IAppState } from "./app.store";

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}/timer`;

export type timerStartAction = (startTimer: StartTimerDTO) => Promise<void>;
export type timerEndAction = (endTimer: EndTimerDTO) => Promise<void>;
export interface ITimerState {
  foo: string;
}

export const timerStore: Module<ITimerState, IAppState> = {
  namespaced: true,
  actions: {
    start: ({ dispatch }, startTimer: StartTimerDTO): Promise<void> => new Promise((resolve, reject) => {
      Axios.post(`${apiPath}/start`, startTimer.serialize()).then(() => resolve()).catch((error: any) => dispatch("error/submit", { code: 500, message: "Error while starting timer", error }));
    }),
    stop: ({ dispatch }, endTimer: EndTimerDTO): Promise<void> => new Promise((resolve, reject) => {
      Axios.put(`${apiPath}/${endTimer.id}/stop`, endTimer.serialize()).then(() => resolve()).catch((error: any) => dispatch("error/submit", { code: 500, message: "Error while stopping timer", error }));
    }),
  } as ActionTree<ITimerState, IAppState>,
  state: {
  } as ITimerState,
};
