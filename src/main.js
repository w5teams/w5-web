import Vue from "vue";
import Antd from "ant-design-vue";
import { message } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import axios from "axios";
import dayjs from "dayjs";
import VueClipboard from 'vue-clipboard2'

import store from "./store";
import VueCookies from "vue-cookies";

import App from "./App";
import router from "./router";

import reqid from "./utils/reqid";


Vue.use(VueClipboard)

Vue.use(Antd);
Vue.use(VueCookies);

Vue.config.productionTip = false;

if (document.location.port == 8080) {
  Vue.prototype.BaseURL = "http://dev-test.w5soar.com";
} else {
  Vue.prototype.BaseURL = document.location.origin;
}

Vue.prototype.W5Version = "0.6.3";
Vue.prototype.W5VersionTime = "2023-01-29";
Vue.prototype.Dayjs = dayjs;
Vue.http = Vue.prototype.$http = axios;

axios.defaults.baseURL = Vue.prototype.BaseURL;
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.post["Cache-Control"] = "no-cache";

//添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.common["token"] = VueCookies.get("token");
    config.headers.common["account"] = VueCookies.get("account");
    config.headers.common["user_id"] = VueCookies.get("user_id");
    config.headers.common["requestId"] = reqid.GetRequestId();
    config.headers.common["timestamp"] = new Date().getTime();

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (response.data.code == 9002) {
      // token 失效
      $cookies.remove("token");
      $cookies.remove("nick_name");
      $cookies.remove("account");
      $cookies.remove("user_id");

      window.location.href = "/";
    } else if (response.data.code == 9002) {
      // 无权限访问
      router.push({ name: "err403" });
    }
    return response.data;
  },
  function (error) {
    message.destroy();
    message.error(error + "");
    return Promise.reject(error);
  }
);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    var isToken = $cookies.isKey("token");

    if (isToken) {
      if (to.name == "403") {
        next();
      } else {
        try {
          var user_nav = VueCookies.get("user_nav").split(",");

          if (user_nav.indexOf(to.name) > -1) {
            next();
          } else {
            next({ path: "/403" });
          }
        } catch (error) {
          next();
        }
      }
    } else {
      next({ path: "/" });
    }
  } else {
    var isToken = $cookies.isKey("token");
    if (isToken) {
      if (to.name == "Login") {
        next({
          path: "/dashboard"
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});