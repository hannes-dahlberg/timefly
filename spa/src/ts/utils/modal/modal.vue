<template>
  <div class="modal" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <component ref="component" v-on:open="open" v-on:close="close" v-on:hide="hide" :is="component" :data="data" :options="options"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class ModalComponent extends Vue {
  @Watch('component') componentChange = (value: any, oldValue: any) => {
    if(oldValue === undefined) {
      this.componentMounted();
    }
  }

  beforeMount() {
    document.body.appendChild(this.$el);
  }
  componentMounted() {
    /*if(this.options === undefined || (this.options !== undefined && this.options.beforeOpen === undefined)) {
      this.open();
    }*/
  }
  open() {
    $(this.$refs.modal).modal("show");
  }
  close(data) {
    $(this.$refs.modal).modal("hide");
    this.$emit("close", data);
  }
  hide(data) {
    $(this.$refs.modal).modal("hide");
    this.$emit("hide", data);
  }
}
</script>