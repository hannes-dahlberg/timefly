<template>
  <ModalComponent title="Add timer" ref="modal">
    <template slot="body">
      <form v-on:submit.prevent="save" ref="form">
        <div class="form-group">
          <label>Project</label>
          <select class="form-control" v-model="selectedProject" :disabled="loading">
            <template v-for="client in clients">
              <template v-if="client.projects">
                <option disabled v-bind:key="'client_' + client.id">{{ client.name }}</option>
                <option
                  v-for="project in client.projects"
                  v-bind:key="'project_'+ project.id"
                  :value="project"
                >{{ project.name }}</option>
              </template>
            </template>
          </select>
        </div>
        <div class="form-group">
          <label>Task</label>
          <select class="form-control" v-model="selectedTask" :disabled="loading">
            <option
              v-for="task in tasks"
              v-bind:key="'task_' + task.id"
              :value="task"
            >{{ task.name }}</option>
            <option v-if="tasks.length === 0" value disabled>Välj projekt först</option>
          </select>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Datum</label>
              <input class="form-control" type="text" :value="dateFormated" disabled>
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
                :disabled="loading"
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
                :disabled="loading"
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
                :disabled="loading"
              ></textarea>
            </div>
          </div>
        </div>
        <button type="submit" class="hidden_submit"></button>
      </form>
    </template>
    <template slot="footer">
      <buttonComponent
        type="submit"
        class="btn btn-primary"
        :loading="loading"
        :disabled="loading || !isValid"
        v-on:click="save"
      >
        <template>{{ submitText }}</template>
      </buttonComponent>
      <button type="button" class="btn btn-secondary" v-on:click.prevent="close">Avbryt</button>
    </template>
  </ModalComponent>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import moment from "moment";

import ModalComponent from "./modal.component.vue";
import ButtonComponent from "./button.component.vue";

import {
  ClientViewModel,
  ProjectViewModel,
  TaskViewModel
} from "../view-models";
import {
  ClientDTO,
  ProjectDTO,
  TaskDTO,
  CreateReportDTO,
  StartTimerDTO
} from "../../../../shared/dto";
import { clientIndexAction } from "../store/client.store";
import { timerStartAction } from "../store/timer.store";
import { reportCreateAction } from "../store/report.store";
import { DateTimeModel } from "../../../../shared/models";

@Component({
  components: { ModalComponent, ButtonComponent }
})
export default class AddTimerComponent extends Vue {
  @Action("client/index") clientIndex: clientIndexAction;
  @Action("timer/start") timerStart: timerStartAction;
  @Action("report/add") reportAdd: reportCreateAction;
  @Prop({ type: DateTimeModel, default: new DateTimeModel(new Date()) })
  date: DateTimeModel;

  //Watcher for reseting task when selected project changes
  @Watch("selectedProject")
  onSelectedProjectChange(
    value: ProjectViewModel,
    oldValue: ProjectViewModel
  ): void {
    if (value !== null && oldValue !== null && value.id !== oldValue.id) {
      if (value.tasks && value.tasks.length !== 0) {
        this.selectedTask = value.tasks[0];
      } else {
        this.selectedTask = null;
      }
    }
  }

  public get dateFormated(): string {
    let header = moment(this.date.toDate())
      .locale("sv")
      .format("YYYY-MM-DD");

    return header.charAt(0).toUpperCase() + header.slice(1);
  }

  public get submitText(): string {
    if (this.to !== "") {
      return "Spara";
    }
    return "Starta";
  }

  public loading: boolean = false;

  public get isValid(): boolean {
    return this.selectedTask !== null;
  }

  public clients: ClientViewModel[] = [];
  public get tasks(): TaskViewModel[] {
    if (
      this.selectedProject !== null &&
      this.selectedProject.tasks !== undefined
    ) {
      return this.selectedProject.tasks;
    }
    return [];
  }

  public get modal(): Vue {
    return this.$refs.modal as Vue;
  }

  public selectedProject: ProjectViewModel | null = null;
  public selectedTask: TaskViewModel | null = null;
  public from: string = "";
  public to: string = "";
  public comment: string = "";

  public mounted() {
    this.$on("show", () => {
      //Reset form data
      this.resetForm();

      // Fetch clients
      this.clientIndex().then((clients: ClientDTO[]) => {
        this.clients = clients.map((client: ClientDTO) =>
          ClientViewModel.fromClientDTO(client)
        );

        // Setting selected project and task to first found
        if (this.clients[0].projects !== undefined) {
          const projects = this.clients[0].projects;
          if (projects !== undefined) {
            this.selectedProject = projects[0];
            const tasks = projects[0].tasks;
            if (tasks !== undefined) {
              this.selectedTask = tasks[0];
            }
          }
        }
      });
      (this.$refs.modal as Vue).$emit("show");
    });
    this.$on("hide", () => {
      this.modal.$emit("hide");
    });
  }

  public parseToTime(value: string): string {
    let date = moment(value, "HHmm");
    if (date.isValid()) {
      return date.format("HH:mm");
    }

    return "";
  }

  public save() {
    if (this.loading || !this.isValid) {
      return;
    }
    this.loading = true;

    if (this.to !== "") {
      this.reportAdd(
        CreateReportDTO.parse({
          taskId: (this.selectedTask as TaskViewModel).id,
          start: `${this.date.toDateString()} ${this.from}`,
          end: `${this.date.toDateString()} ${this.to}`,
          comment: this.comment
        })
      )
        .then(() => this.close())
        .catch(() => (this.loading = false));
    } else {
      this.timerStart(
        StartTimerDTO.parse({
          taskId: (this.selectedTask as TaskViewModel).id,
          start:
            this.from !== ""
              ? `${this.date.toDateString()} ${this.from}`
              : new DateTimeModel(
                  `${this.date.toDateString()} ${new DateTimeModel()
                    .toMoment()
                    .format("HH:mm:00")}`
                ).toString(),
          comment: this.comment
        })
      )
        .then(() => this.close())
        .catch(() => (this.loading = false));
    }
  }

  public close() {
    this.loading = false;
    this.modal.$emit("hide");
    this.$emit("close");
  }

  public resetForm() {
    this.selectedProject = null;
    this.selectedTask = null;
    this.from = "";
    this.to = "";
    this.comment = "";
  }
}
</script>