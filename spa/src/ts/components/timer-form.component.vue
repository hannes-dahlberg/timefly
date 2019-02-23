<template>
  <form v-on:submit.prevent="submit">
    <div class="modal-header">
      <h5 class="modal-title">Timer Form</h5>
      <button type="button" class="close" v-on:click="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Project</label>
        {{ selectedProject ? selectedProject.id : null }}
        <select
          class="form-control"
          v-model="selectedProjectId"
          :disabled="isLoading"
        >
          <template v-for="client in clients">
            <template v-if="client.projects">
              <option disabled v-bind:key="'client_' + client.id">{{ client.name }}</option>
              <option
                v-for="project in client.projects"
                v-bind:key="'project_'+ project.id"
                :value="project.id"
              >{{ project.name }}</option>
            </template>
          </template>
        </select>
      </div>
      <div class="form-group">
        <label>Task</label>
        {{ selectedTask ? selectedTask.id : null }}
        <select
          class="form-control"
          v-model="selectedTaskId"
          :disabled="isLoading"
        >
          <option
            v-for="task in tasks"
            v-bind:key="'task_' + task.id"
            :value="task.id"
          >{{ task.name }}</option>
          <option v-if="tasks.length === 0" value disabled>Välj projekt först</option>
        </select>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Datum</label>
            <input
              class="form-control"
              type="text"
              v-model="date"
              v-on:blur="date = parseToDate(date)"
            >
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Från</label>
            <input
              class="form-control"
              type="text"
              v-model="from"
              v-on:blur="from = parseToTime(from)"
              :disabled="isLoading"
            >
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Till</label>
            <input
              class="form-control"
              type="text"
              v-model="to"
              v-on:blur="to = parseToTime(to)"
              :disabled="isLoading"
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Kommentar</label>
            <textarea
              class="form-control"
              v-model="comment"
              style="resize: none"
              rows="4"
              :disabled="isLoading"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer d-flex">
      <buttonComponent
        v-if="type === 'edit'"
        type="button"
        class="mr-auto mdo-btn mdo-btn--contained mdo-btn--danger"
        v-on:click="remove"
      >
        <i class="far fa-trash-alt"></i>
      </buttonComponent>
      <buttonComponent
        type="button"
        class="mdo-btn mdo-btn--text mdo-btn--secondary"
        v-on:click="close"
      >{{ $t('timer.button.cancel') }}</buttonComponent>
      <buttonComponent
        type="submit"
        class="mdo-btn mdo-btn--contained mdo-btn--primary"
        :loading="isLoading"
        :disabled="isLoading || !isValid"
      >{{ $t('timer.button.save') }}</buttonComponent>
    </div>
  </form>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action } from "vuex-class";
import moment from "moment";

// Components
import ButtonComponent from "./button.component.vue";

import * as loading from "../utils/loading/loading.plugin";

// Models
import { clientIndexAction } from "../store/client.store";
import { timerStartAction } from "../store/timer.store";
import {
  reportCreateAction,
  reportEditAction,
  reportRemoveAction
} from "../store/report.store";
import { DateTimeModel } from "../../../../shared/models";
import { ProjectViewModel } from "../view-models/project.view-model";
import { ClientViewModel } from "../view-models/client.view-model";
import { TaskViewModel } from "../view-models/task.view-model";
import { ReportViewModel } from "../view-models/report.view-model";
import {
  ClientDTO,
  CreateReportDTO,
  StartTimerDTO,
  EditReportDTO
} from "../../../../shared/dto";
import { confirmModalInit } from "./confirm-modal.component.vue";

const LOADING_NAME = "timer.form";

export type timerFormType = "add" | "edit";

@Component({
  components: { ButtonComponent }
})
export default class TimerFormComponent extends Vue {
  @Action("client/index") clientIndex: clientIndexAction;
  @Action("timer/start") timerStart: timerStartAction;
  @Action("report/add") reportAdd: reportCreateAction;
  @Action("report/update") reportUpdate: reportEditAction;
  @Action("report/remove") reportRemove: reportRemoveAction;

  @Prop({ type: Object, default: null })
  data: {
    type: timerFormType;
    report?: ReportViewModel;
    date?: DateTimeModel;
  };

  //Watcher for reseting task when selected project changes
  @Watch("selectedProjectId")
  onSelectedProjectChange(value: number, oldValue: number): void {
    if (
      value !== null &&
      value !== undefined &&
      oldValue !== null &&
      oldValue !== undefined &&
      value !== oldValue
    ) {
      if (this.selectedProjectHasTasks) {
        this.selectedTaskId = ((this.selectedProject as ProjectViewModel)
          .tasks as TaskViewModel[])[0].id;
      }
    }
  }

  // Validates form
  public get isValid(): boolean {
    return true;
    //return this.selectedTask !== null;
  }

  public get isLoading(): boolean {
    return this.$loading.isOn(LOADING_NAME);
  }

  // Clients and task container
  public clients: ClientViewModel[] = [];

  // List of tasks depending on selected project
  public get tasks(): TaskViewModel[] {
    if (
      this.selectedProject !== null &&
      this.selectedProject !== undefined &&
      this.selectedProject.tasks !== undefined
    ) {
      return this.selectedProject.tasks;
    }
    return [];
  }

  // Get the selected project by looking up project ID in clients
  public get selectedProject(): ProjectViewModel | undefined {
    return this.clients
      .map((client: ClientViewModel) =>
        client.projects !== undefined
          ? client.projects.find(
              (project: ProjectViewModel) =>
                project.id === this.selectedProjectId
            )
          : undefined
      )
      .filter((project: ProjectViewModel) => project !== undefined)[0];
  }

  // Check for if selected project has any tasks
  public get selectedProjectHasTasks(): boolean {
    return (
      this.selectedProject !== undefined &&
      this.selectedProject.tasks !== undefined &&
      this.selectedProject.tasks.length > 0
    );
  }

  // Get the selected task by looking up task ID in selected project
  public get selectedTask(): TaskViewModel | undefined {
    return this.selectedProjectHasTasks
      ? ((this.selectedProject as ProjectViewModel)
          .tasks as TaskViewModel[]).find(
          (task: TaskViewModel) => task.id === this.selectedTaskId
        )
      : undefined;
  }

  private type: timerFormType = "add";

  // Form data
  public reportId: number | null = null;
  public selectedProjectId: number | null = null;
  public selectedTaskId: number | null = null;
  public date: string = "";
  public from: string = "";
  public to: string = "";
  public comment: string = "";

  // Component mounted
  public mounted() {
    this.open();
  }

  // Form is openen
  private open() {
    if (this.data === undefined) {
      return;
    }

    this.type = this.data.type;
    if (this.data.date) {
      this.date = this.data.date.toDateString();
    }
    const type = this.data.type;
    const report = this.data.report;
    if (type == "edit" && report !== undefined) {
      this.reportId = report.id;
      this.date = report.start.toMoment().format("YYYY-MM-DD");
      this.from = report.start.toMoment().format("HH:mm");
      this.to =
        report.end !== undefined ? report.end.toMoment().format("HH:mm") : "";
      this.comment = report.comment;
    } else if (type == "add") {
      this.reportId = null;
      this.from = "";
      this.to = "";
      this.comment = "";
    }
    // Fetch clients
    this.clientIndex().then((clients: ClientDTO[]) => {
      this.clients = clients.map((client: ClientDTO) =>
        ClientViewModel.fromClientDTO(client)
      );

      if (
        type == "edit" &&
        report !== undefined &&
        report.task !== undefined &&
        report.task.project !== undefined
      ) {
        this.selectedProjectId = report.task.project.id;
        this.selectedTaskId = report.task.id;
      } else if (this.clients[0].projects !== undefined) {
        // Setting selected project and task to first found
        const projects = this.clients[0].projects;
        if (projects !== undefined) {
          this.selectedProjectId = projects[0].id;
          const tasks = projects[0].tasks;
          if (tasks !== undefined) {
            this.selectedTaskId = tasks[0].id;
          }
        }
      }

      // Clients loaded, show modal
      this.$emit("open");
    });
  }

  // Form is closed
  private close() {
    this.$loading.end(LOADING_NAME);
    // Hiding modal
    this.$emit("close");
  }

  // Submitting form
  public submit() {
    if (this.isLoading || !this.isValid) {
      return;
    }
    this.$loading.start(LOADING_NAME);

    if (this.type === "add") {
      if (this.to !== "") {
        this.reportAdd(
          CreateReportDTO.parse({
            taskId: (this.selectedTask as TaskViewModel).id,
            start: `${this.date} ${this.from}`,
            end: `${this.date} ${this.to}`,
            comment: this.comment
          })
        )
          .then(() => this.close())
          .catch(() => this.$loading.end(LOADING_NAME));
      } else {
        this.timerStart(
          StartTimerDTO.parse({
            taskId: (this.selectedTask as TaskViewModel).id,
            start:
              this.from !== ""
                ? `${this.date} ${this.from}`
                : new DateTimeModel(
                    `${this.date} ${new DateTimeModel()
                      .toMoment()
                      .format("HH:mm:00")}`
                  ).toString(),
            comment: this.comment
          })
        )
          .then(() => this.close())
          .catch(() => this.$loading.end(LOADING_NAME));
      }
    } else {
      if (this.reportId !== null && this.selectedTaskId !== null) {
        this.reportUpdate(
          EditReportDTO.parse({
            id: this.reportId,
            taskId: this.selectedTaskId,
            start: `${this.date} ${this.from}`,
            ...(this.to !== "" ? { end: `${this.date} ${this.to}` } : null),
            comment: this.comment
          })
        )
          .then(() => this.close())
          .catch(() => this.$loading.end(LOADING_NAME));
      }
    }
  }

  public remove() {
    confirmModalInit(
      {
        type: "yesno",
        title: this.$t("timer.remove.title").toString(),
        message: this.$t("timer.remove.message").toString()
      },
      {
        beforeClose: () => {
          return new Promise((resolve, reject) => {
            if (this.reportId === null) {
              resolve();
              return;
            }
            this.reportRemove(this.reportId)
              .then(() => resolve())
              .catch(() => resolve());
          });
        }
      }
    )
      .then(() => {
        this.close();
      })
      .catch(() => {});
  }

  public parseToTime(value: string): string {
    let date = moment(value, "HHmm");
    if (date.isValid()) {
      return date.format("HH:mm");
    }

    return "";
  }

  public parseToDate(value: string): string {
    let date = moment(value, "YYYYMMDD");
    if (date.isValid()) {
      return date.format("YYYY-MM-DD");
    }

    return "";
  }
}
</script>