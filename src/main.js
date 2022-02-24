import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';

// css样式还是需要全部引入
import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'

import './assets/icon_font/iconfont.css'

// 全局函数
import functions from './utils/globalFunctions.js';
// 防止重复点击
import preventClick from './utils/clickStatefrom';

Vue.use(element)

Vue.config.productionTip = false;

Vue.prototype.$axios = axios

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'login') {
    if (sessionStorage.getItem("token")) {
      next()
    } else {
      next('/')
    }
  } else {
    next() // 确保一定要有next()被调用
  }

  let allowBack = false //    给个默认值true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  if (!allowBack) {
    history.pushState(null, null, location.href)
  }
  store.dispatch('updateAppSetting', { //   updateAppSetting 只是store里面的一个action， 用来改变store里的allowBack的值的，具体怎么改这个值 要根据各位的实际情况而定
    allowBack: allowBack
  })
})

// http 请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求前
  let pathname = location.pathname;
  // console.log(pathname);
  if (sessionStorage.getItem('token')) {
    if (pathname !== '#/' && pathname !== '#/login') {
      config.headers.common['token'] = sessionStorage.getItem('token');
    }
  };

  return config
}, err => {
  return Promise.reject(err);
})

// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          sessionStorage.setItem("token", null);
          sessionStorage.setItem("role", null);
          console.log(router.currentRoute.fullPath)
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath //登录成功后跳入浏览的当前页面
            }
          })
      }
    }
    return Promise.reject(error.response)
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");