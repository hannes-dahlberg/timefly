import Vue from "vue";
import { DirectiveFunction, VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

const inputFocusDirective: DirectiveFunction = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) => {
  if (binding) { el.focus(); }
};

export default inputFocusDirective;
