import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
//权限拦截
import "./permisson";
//使用
Vue.use(ElementUI);

Vue.config.productionTip = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV); //开发环境 development  生产环境 production
new Vue({
  router,
  store, // 注册
  render: h => h(App)
}).$mount("#app");
