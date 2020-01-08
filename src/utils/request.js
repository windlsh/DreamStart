import axios from "axios";
import { Loading, Message } from "element-ui";

const request = axios.create({
  // baseURL: "/dev-api2",
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000
});
const loading = {
  loadingInstance: null, // loading 实例
  open: function() {
    if (this.loadingInstance === null) {
      // 如果实例为空  则创建
      this.loadingInstance = Loading.service({
        target: ".main",
        text: "拼命加载中...",
        background: "rgba(0,0,0,0.5)"
      });
    }
  },
  close: function() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  }
};

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    loading.open();
    return config;
  },
  function(error) {
    loading.close();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    loading.close();

    const resp = response.data;
    if (resp.code !== 2000) {
      Message({
        message: resp.message || "系统异常",
        type: "warning",
        duration: 5 * 1000
      });
    }
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    loading.close();
    // 对响应错误做点什么
    console.log("response.error", error);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default request; // 导出自定义创建对象
