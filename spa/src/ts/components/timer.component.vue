'<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-8">
        <h4>{{ this.dateHeader }}</h4>
      </div>
      <div class="col-4 text-right">
        <div class="mdo-btn-group" role="group">
          <router-link
            :to="{ query: { date: previousDay() } }"
            class="mdo-btn mdo-btn--contained mdo-btn--secondary"
          >
            <i class="fas fa-chevron-left"></i>
          </router-link>
          <router-link
            :to="{ query: { date: today() } }"
            class="mdo-btn mdo-btn--outlined mdo-btn--secondary text-center"
            style="min-width: 130px;"
          >{{ todayReference }}</router-link>
          <router-link
            :to="{ query: { date: nextDay() } }"
            class="mdo-btn mdo-btn--contained mdo-btn--secondary"
          >
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
              class="mdo-btn mdo-btn--contained mdo-btn--primary"
              style="width: 100%; height: 100%;"
            >
              <i class="fas fa-plus fa-2x"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-11">
        <div class="card bg-light">
          <div class="card-body p-0">
            <div
              class="row flex timer m-0"
              v-for="report in reports"
              v-bind:class="{ 'timer--active flashing flashing--bg': report.isActive }"
              v-bind:key="report.id"
            >
              <div class="col-2">
                <p>
                  <b>{{ report.start.toMoment().format('HH:mm') }}</b>
                </p>
                <p>
                  <b>{{ report.end !== undefined ? report.end.toMoment().format("HH:mm") : "&nbsp;" }}</b>
                </p>
              </div>
              <div class="col-6">
                <p>
                  <b>{{ report.task.project.name }}</b>
                  <small>({{ report.task.project.client.name }})</small>
                </p>
                <p>
                  {{ report.task.name }} -
                  <span class="text-muted">{{ report.comment }}</span>
                </p>
              </div>
              <div class="col-2 align-self-center">
                  <div class="align-self-center text-right">
                    {{ report.diffHours }}h {{ report.diffMinutes }}m
                  </div>
              </div>
              <div class="col-2 align-self-center">
                <div class="d-flex justify-content-end">
                  <div class="align-self-center text-right">
                    <button
                      v-if="report.isActive"
                      class="mdo-btn mdo-btn--contained mdo-btn--primary"
                      v-on:click.prevent="stop(report)"
                    >{{ $t('timer.button.stop') }}</button>
                    <button v-else class="mdo-btn mdo-btn--outlined mdo-btn--secondary" v-on:click.prevent="start(report)">{{ $t('timer.button.start') }}</button>
                    <button class="mdo-btn mdo-btn--outlined mdo-btn--secondary" v-on:click="edit(report)">
                      <i class="fas fa-pen"></i>
                    </button>
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
import VueRouter from "vue-router";
import { Action } from "vuex-class";
import moment from "moment";
import VueI18n from "vue-i18n";
import { reportIndexAction } from "../store/report.store";
import TimerFormComponent from "./timer-form.component.vue";
import { confirmModalInit } from "./confirm-modal.component.vue";
import ConfirmModalComponent from "./confirm-modal.component.vue";
import { ReportDTO, StartTimerDTO } from "../../../../shared/dto";
import { ReportViewModel, ViewModel } from "../view-models";
import { DateTimeModel } from "../../../../shared/models";
import { timerEndAction, timerStartAction } from "../store/timer.store";
import { modal } from "../utils/modal/modal";
import * as loading from "../utils/loading/loading.plugin";

@Component({
  components: { TimerFormComponent }
})
export default class TimerComponent extends Vue {
  @Action("report/index") reportIndex: reportIndexAction;
  @Action("timer/stop") timerStop: timerEndAction;
  @Action("timer/start") timerStart: timerStartAction;
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
      .format("dddd D/M YYYY");

    return header.charAt(0).toUpperCase() + header.slice(1);
  }
  public get todayReference(): string {
    return this.date
      .toMoment()
      .calendar(undefined, {
        sameDay: `[${this.$t("timer.today")}]`,
        nextDay: `[${this.$t("timer.tomorrow")}]`,
        lastDay: `[${this.$t("timer.yesterday")}]`,
        nextWeek: "D/M",
        lastWeek: "D/M",
        sameElse: "D/M"
      });
  }

  private get timerForm(): Vue {
    return (this.$refs.timerForm as Vue);
  }

  public get dateRouteQuery(): string | null {
    return this.$route.query.date ? this.$route.query.date.toString() : null;
  }
  public mounted() {
    this.setDateFromRouteQuery();
    setInterval(() => this.updateDiffs(), 1000);
  }

  public getReports() {
    this.reportIndex(this.date.toDate()).then((reports: ReportDTO[]) => {
      this.reports = reports.map((report: ReportDTO) =>
        ReportViewModel.fromReportDTO(report)
      );
    });
  }

  public updateDiffs() {
    this.reports = this.reports.map((report: ReportViewModel) => {
        return report;
      });
  }

  private setDateFromRouteQuery() {
    if (this.dateRouteQuery === null) {
      this.$router.push({ query: { date: this.date.format("YYYY-MM-DD") } });
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

  public minutes(minutes: number): string {
    return minutes > 9 ? minutes.toString() : `0${minutes}`;
  }

  public add() {
    this.$modal.init({ component: TimerFormComponent, data: { type: "add", date: this.date } })
    .then(() => {
      this.getReports();
    });
  }

  public edit(report: ReportDTO) {
    this.$modal.init({ component: TimerFormComponent, data: { type: "edit", report: report } })
    .then(() => {
      this.getReports();
    });
  }

  public start(report: ReportViewModel) {
        if(report.task === undefined) { return; }
        this.timerStart(
          StartTimerDTO.parse({
            taskId: report.task.id,
            start: new DateTimeModel().toMoment().format("YYYY-MM-DD HH:mm:00"),
            comment: report.comment
          })
        )
          .then(() => this.getReports());
  }

  public stop(report: ReportViewModel) {
    this.timerStop({ id: report.id, end: new DateTimeModel().toMoment().format("YYYY-MM-DD HH:mm:00") }).then(() => {
      this.getReports();
    });
  }
}
</script>