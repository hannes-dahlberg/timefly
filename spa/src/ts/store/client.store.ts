import { AxiosResponse, default as Axios } from "axios";
import { ActionTree, Module } from "vuex";
import { ClientDTO, IClientJSON } from "../../../../shared/dto";
import { IAppState } from "./app.store";

export type clientIndexAction = () => Promise<ClientDTO[]>;

export interface IClientState { } // tslint:disable-line:no-empty-interface

export const clientStore: Module<IClientState, IAppState> = {
  namespaced: true,
  actions: {
    index: ({ dispatch }): Promise<ClientDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get(`/client`).then((response: AxiosResponse<IClientJSON[]>) => {
          resolve(response.data.map((client: IClientJSON) => ClientDTO.parse(client)));
        }).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while fetching clients", error }); reject(error); });
      });
    },
  } as ActionTree<IClientState, IAppState>,
};
