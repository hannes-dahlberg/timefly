import { AxiosResponse, default as Axios } from "axios";
import moment from "moment";
import { ActionTree, Module } from "vuex";

import { IAppState } from "./app.store";

import { CreateReportDTO, ICreateReportJSON, IReportJSON, ReportDTO } from "../../../../shared/dto";

export interface IReportState {
  foo: string;
}

export type reportIndexAction = (date: Date) => Promise<ReportDTO[]>;
export type reportCreateAction = (createReport: CreateReportDTO) => Promise<void>;

export const apiPath: string = `http://${process.env.API_HOST}:${process.env.PORT}/report`;

export const reportStore: Module<IReportState, IAppState> = {
  namespaced: true,
  actions: {
    index: ({ }, date: Date): Promise<ReportDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get(apiPath, { params: { date: moment(date).format("YYYY-MM-DD") } }).then((response: AxiosResponse<IReportJSON[]>) => {
          resolve(response.data.map((client: IReportJSON) => ReportDTO.parse(client)));
        }).catch((error: any) => reject(error));
      });
    },
    add: ({ }, payload: ICreateReportJSON): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.post(apiPath, payload).then(() => resolve()).catch((error: any) => reject(error));
      });
    },
  } as ActionTree<IReportState, IAppState>,
};
