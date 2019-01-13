import { AxiosResponse, default as Axios } from "axios";
import { ActionTree, Module } from "vuex";
import moment from 'moment';

import { IAppState } from "./app.store";

import { ReportDTO, CreateReportDTO, IReportJSON, ICreateReportJSON } from "../../../../shared/dto";

export interface IReportState {

}

export type reportIndexAction = (date: Date) => Promise<IReportJSON[]>;
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
    }
  } as ActionTree<IReportState, IAppState>
}

