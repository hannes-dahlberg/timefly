import { default as Axios } from "axios";
import { ActionTree, Module } from "vuex";
import { EndTimerDTO, IEndTimerJSON, StartTimerDTO } from "../../../../shared/dto";
import { IAppState } from "./app.store";

export type timerStartAction = (startTimer: StartTimerDTO) => Promise<void>;
export type timerEndAction = (endTimer: IEndTimerJSON) => Promise<void>;
export interface ITimerState {
  foo: string;
}

export const timerStore: Module<ITimerState, IAppState> = {
  namespaced: true,
  actions: {
    start: ({ dispatch }, startTimer: StartTimerDTO): Promise<void> => new Promise((resolve, reject) => {
      Axios.post("timer/start", startTimer.serialize()).then(() => resolve()).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while starting timer", error }); reject(error); });
    }),
    stop: ({ dispatch }, endTimer: IEndTimerJSON): Promise<void> => new Promise((resolve, reject) => {
      Axios.put(`timer/${endTimer.id}/stop`, EndTimerDTO.parse(endTimer).serialize()).then(() => resolve()).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while stopping timer", error }); reject(error); });
    }),
  } as ActionTree<ITimerState, IAppState>,
  state: {
  } as ITimerState,
};
