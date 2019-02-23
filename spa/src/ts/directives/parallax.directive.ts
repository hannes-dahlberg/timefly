import { DirectiveFunction, VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

const parallaxDirective: DirectiveFunction = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) => {
  if (!binding.value) { return; }
  this.scrollEvent = $(window).scroll((e) => {
    $(el).css("background-position-y", ($(window).scrollTop() - $(el).offset().top) * binding.value.speed);
  });
};

export default parallaxDirective;
