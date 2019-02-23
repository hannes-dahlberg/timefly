import { DirectiveFunction, VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

const navbarFoldDirective: DirectiveFunction = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) => {
  const threshold = binding.value && binding.value.threshold !== undefined ? binding.value.threshold : 50;
  this.scrollEvent = $(window).scroll((e) => {
    if ($(window).scrollTop() > threshold) {
      $(el).addClass("navbar-folded");
    } else {
      $(el).removeClass("navbar-folded");
    }
  });
};

export default navbarFoldDirective;
