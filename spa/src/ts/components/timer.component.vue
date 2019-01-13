<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <h4>{{ this.dateHeader }}</h4>
      </div>
      <div class="col-4 text-right">
        <div class="btn-group" role="group">
          <router-link :to="{ query: { date: previousDay() } }" class="btn btn-secondary">
            <i class="fas fa-chevron-left"></i>
          </router-link>
          <router-link
            :to="{ query: { date: today() } }"
            class="btn btn-outline-secondary"
          >{{ todayReference }}</router-link>
          <router-link :to="{ query: { date: nextDay() } }" class="btn btn-secondary">
            <i class="fas fa-chevron-right"></i>
          </router-link>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-1">
        <div class="square-size">
          <div class="square-size__content">
            <button
              type="button"
              v-on:click="add"
              class="btn btn-primary"
              style="width: 100%; height: 100%;"
            >
              <i class="fas fa-plus fa-2x"></i>
            </button>
            <AddTimerComponent ref="startTimer" :date="date"></AddTimerComponent>
          </div>
        </div>
      </div>
      <div class="col-11">
        <div class="card bg-light">
          <div class="card-body">
            <div
              class="row flex timer"
              v-for="report in reports"
              v-bind:class="{ 'timer--active': report.end === null }"
              v-bind:key="report.id"
            >
              <div class="col-2">
                <p>
                  <b>{{ report.start.toMoment().format('HH:mm') }}</b>
                </p>
                <p>
                  <b>{{ report.end !== null ? report.end.toMoment().format("HH:mm") : "&nbsp;" }}</b>
                </p>
              </div>
              <div class="col-7">
                <p>
                  <b>{{ report.task.project.name }}</b>
                  <small>({{ report.task.project.client.name }})</small>
                </p>
                <p>
                  {{ report.task.name }} -
                  <span class="text-muted">{{ report.comment }}</span>
                </p>
              </div>
              <div class="col-3 align-self-center">
                <div class="d-flex justify-content-end">
                  <div class="align-self-center text-right mr-2">
                    <span>{{ diffHours(report.start, report.end ? report.end : null) }}</span>
                  </div>
                  <div class="align-self-center text-right">
                    <button
                      v-if="report.isActive"
                      class="btn btn-primary"
                      v-on:click.prevent="stop(report.id)"
                    >Stop</button>
                    <button v-else class="btn btn-outline-secondary">Start</button>
                    <button class="btn btn-sm btn-outline-secondary">
                      <i class="fas fa-pen"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import moment from "moment";
import "moment/locale/sv";
import { reportIndexAction } from "../store/report.store";
import { AddTimerComponent } from "./";
import { ReportDTO } from "../../../../shared/dto";
import { ReportViewModel, ViewModel } from "../view-models";
import { DateTimeModel } from "../../../../shared/models";
import { timerEndAction } from "../store/timer.store";

@Component({
  components: { AddTimerComponent }
})
export default class TimerComponent extends Vue {
  @Action("report/index") reportIndex: reportIndexAction;
  @Action("timer/stop") timerStop: timerEndAction;
  @Watch("dateRouteQuery")
  onDateRouteQueryChange(value: string | null) {
    this.setDateFromRouteQuery();
  }
  @Watch("date")
  onDateChange(value: DateTimeModel) {
    this.getReports();
  }
  public reports: ReportViewModel[] = [];
  public date: DateTimeModel = new DateTimeModel(new Date());

  public get dateHeader(): string {
    let header = this.date
      .toMoment()
      .locale("sv")
      .format("dddd D/M YYYY");

    return header.charAt(0).toUpperCase() + header.slice(1);
  }
  public get todayReference(): string {
    return this.date
      .toMoment()
      .locale("sv")
      .calendar(undefined, {
        sameDay: "[Idag]",
        nextDay: "[Imorgon]",
        lastDay: "[Igår]",
        nextWeek: "D/M",
        lastWeek: "D/M",
        sameElse: "D/M"
      });
  }

  public get dateRouteQuery(): string | null {
    return this.$route.query.date ? this.$route.query.date.toString() : null;
  }
  public mounted() {
    this.setDateFromRouteQuery();
  }

  public getReports() {
    this.reportIndex(this.date.toDate()).then((reports: ReportDTO[]) => {
      this.reports = reports.map((report: ReportDTO) =>
        ReportViewModel.fromReportDTO(report)
      );
    });
  }

  private setDateFromRouteQuery() {
    if (this.dateRouteQuery === null) {
      return;
    }
    const tempDate = new DateTimeModel(this.dateRouteQuery, "YYYY-MM-DD");
    if (tempDate.isValid) {
      this.date = tempDate;
    }
  }

  public nextDay() {
    const tempDate = new DateTimeModel(this.date.toDate());
    return tempDate
      .toMoment()
      .add(1, "day")
      .format("YYYY-MM-DD");
  }

  public previousDay() {
    const tempDate = new DateTimeModel(this.date.toDate());
    return tempDate
      .toMoment()
      .subtract(1, "day")
      .format("YYYY-MM-DD");
  }

  public today() {
    const tempDate = new DateTimeModel(new Date());
    return tempDate.toMoment().format("YYYY-MM-DD");
  }

  public diffHours(date1: DateTimeModel, date2: DateTimeModel | null) {
    if (date2 === null) {
      date2 = new DateTimeModel(new Date());
    }
    let hours: number = date2.toMoment().diff(date1.toMoment(), "hours");
    let minutes: number =
      date2.toMoment().diff(date1.toMoment(), "minutes") % 60;

    return `${hours}:${minutes < 9 ? "0" : ""}${minutes}`;
  }

  public add() {
    (this.$refs.startTimer as Vue).$emit("show");
  }

  public stop(report: ReportViewModel) {
    this.timerStop();
  }
}
</script>