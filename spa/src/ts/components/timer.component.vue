<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <h4>Onsdag 19/12 -2018</h4>
      </div>
      <div class="col-4 text-right">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button type="button" class="btn btn-outline-secondary">Idag</button>
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-1">
        <div class="square-size">
          <div class="square-size__content">
            <button type="button" class="btn btn-primary" style="width: 100%; height: 100%;">
              <i class="fas fa-plus fa-2x"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-11">
        <div class="card bg-light">
          <div class="card-body">
            <ModalComponent ref="modal">
              <template slot="body">Hello World</template>
              <template slot="footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </template>
            </ModalComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import { ITimer, indexActionCallback } from "../store/timer.store";
import { ModalComponent } from "./";

@Component({
  components: { ModalComponent }
})
export default class TimerComponent extends Vue {
  @Action("timer/index") index: indexActionCallback;

  public timers: ITimer[] = [];

  public mounted() {
    this.$refs.modal.$emit("show");
    this.index(new Date()).then((timers: ITimer[]) => {
      this.timers = timers;
    });
  }
}
</script>