import { DirectiveFunction, VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

const tooltipDirective: DirectiveFunction = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) => {
  $(el).tooltip(binding.value);
};

export default tooltipDirective;
