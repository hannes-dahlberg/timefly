<template>
  <div class="container-fluid mt-5">
    <router-view></router-view>
  </div>
</template>
<script lang = "ts" >
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";

import { errorPayload, subscribeActionCallback } from "../store/error.store";

@Component
export default class IndexComponent extends Vue {
  @Action("error/subscribe") errorSubscribe: subscribeActionCallback;

  public mounted() {
    this.errorSubscribe((payload: errorPayload) => {
      console.log("SOMETHING WENT WRONG", payload);
    });
  }
}
</script>