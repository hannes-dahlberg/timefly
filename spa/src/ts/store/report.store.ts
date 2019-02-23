import { AxiosResponse, default as Axios } from "axios";
import moment from "moment";
import { ActionTree, Module } from "vuex";

import { IAppState } from "./app.store";

import { CreateReportDTO, EditReportDTO, IReportJSON, ReportDTO } from "../../../../shared/dto";

export interface IReportState {
  foo: string;
}

export type reportIndexAction = (date: Date) => Promise<ReportDTO[]>;
export type reportCreateAction = (createReport: CreateReportDTO) => Promise<void>;
export type reportEditAction = (editReport: EditReportDTO) => Promise<void>;
export type reportRemoveAction = (id: number) => Promise<void>;

export const reportStore: Module<IReportState, IAppState> = {
  namespaced: true,
  actions: {
    index: ({ dispatch }, date: Date): Promise<ReportDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get("/report", { params: { date: moment(date).format("YYYY-MM-DD") } }).then((response: AxiosResponse<IReportJSON[]>) => {
          resolve(response.data.map((client: IReportJSON) => ReportDTO.parse(client)));
        }).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while getting reports", error }); reject(error); });
      });
    },
    add: ({ dispatch }, payload: CreateReportDTO): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.post("/report", payload.serialize()).then(() => resolve()).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while adding report", error }); reject(error); });
      });
    },
    update: ({ dispatch }, payload: EditReportDTO): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.put(`/report/${payload.id}`, payload.serialize()).then(() => resolve()).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while updating report", error }); reject(error); });
      });
    },
    remove: ({ dispatch }, id: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.delete(`/report/${id}`).then(() => resolve()).catch((error: any) => { dispatch("error/submit", { code: 500, message: "Error while deleting report", error }); reject(error); });
      });
    },
  } as ActionTree<IReportState, IAppState>,
};
