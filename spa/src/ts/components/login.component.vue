<template>
  <div class="row justify-content-center mt-5">
    <div class="col-lg-5">
      <div class="card">
        <h5 class="card-header">Login</h5>
        <div class="card-body">
          <form v-on:submit.prevent="submit(form.email, form.password)">
            <div class="form-group">
              <label for="loginEmail">Email address</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                id="loginEmail"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              >
            </div>
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input
                type="password"
                class="form-control"
                id="loginPassword"
                placeholder="Password"
                v-model="form.password"
              >
            </div>
            <div class="d-flex">
              <div>
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
              <div class="form-group custom-control custom-checkbox ml-3 pt-2">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="loginRemember"
                  v-model="form.remember"
                >
                <label class="custom-control-label" for="loginRemember">Remember Me</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import Component from "vue-class-component";
import { default as Axios, AxiosResponse } from "axios";

export interface User {
  emaiL: string;
  id: number;
}

export type loginForm = {
  email: string;
  password: string;
  remember: boolean;
};

const namespace = "AuthStore";

@Component
export default class LoginComponent extends Vue {
  @Action("login", { namespace }) login: any;
  @Getter("token", { namespace }) token: string;
  @Getter("user", { namespace }) user: User;

  public form: loginForm = {
    email: "",
    password: "",
    remember: false
  };

  public submit(email: string, password: string) {
    this.login({ email, password });
  }
}
</script>