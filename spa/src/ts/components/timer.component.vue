<template>
  <div class="row">
    <div class="col">HELLO WORLD</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import { ITimer, indexActionCallback } from "../store/timer.store";

@Component
export default class TimerComponent extends Vue {
  @Action("timer/index") index: indexActionCallback;

  public timers: ITimer[] = [];

  public mounted() {
    this.index(new Date()).then((timers: ITimer[]) => {
      this.timers = timers;
    });
  }
}
</script>