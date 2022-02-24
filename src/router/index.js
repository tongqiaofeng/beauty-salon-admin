import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";

Vue.use(VueRouter);

const routes = [{
  path: "/",
  name: "Login",
  component: Login
}, {
  path: "/home",
  name: "Home",
  component: Home,
  meta: {
    type: 'login',
    allowBack: false
  }
}, ];

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;