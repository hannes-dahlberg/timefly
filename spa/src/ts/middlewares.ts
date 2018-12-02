import { appStore } from './store';
import Vue from 'vue'
import VueRouter, { NavigationGuard, Route, RawLocation } from 'vue-router';

export type navigationGuardNext = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void;

export default {
  //Redirect to 404 page if route is not defined
  invalidRoute(to, from, next) {
    if (to.name) {
      next();
    } else {
      next({ name: 'error.404' });
    }
  },
  //Middleware for authenticated users
  auth: <NavigationGuard>((to, from, next) => {
    //Users not authenticated will be redirected to 404
    next(!appStore.getters['auth/isAuth'] ? { path: '/error/404' } : undefined);
  }),
  guest: <NavigationGuard>((to, from, next) => {
    //Users authenticated will be redirected to 404
    next(appStore.getters['auth/isAuth'] ? { path: '/error/404' } : undefined);
  }),
  errorCode: <NavigationGuard>((to, from, next) => {
    let errorCode = parseInt(to.params['code']);
    next(errorCode < 400 || errorCode > 499 ? { path: '/error/404' } : undefined);
  })
}

export const guard = (guards: NavigationGuard[]) => {
  return (from: Route, to: Route, next: navigationGuardNext) => {
    operate(guards, from, to, next, 0);
  }
}

const operate = (guards: NavigationGuard[], from: Route, to: Route, lastNext: navigationGuardNext, i: number) => {
  let guard: NavigationGuard = guards[i]
  if (guards.length === i + 1) {
    guard(from, to, lastNext)
  } else {
    guard(from, to, (nextArg) => {
      switch (typeof (nextArg)) {
        case 'undefined':
          operate(guards, from, to, lastNext, i + 1)
          break
        case 'object':
          lastNext(nextArg)
          break
        case 'boolean':
          lastNext(nextArg)
          break
        case 'string':
          lastNext(nextArg)
          break
      }
    })
  }
}
