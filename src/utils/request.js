import axios from "axios";
import Vue from "vue";
var that = new Vue();
// MessageBox,
import { Message, MessageBox } from "element-ui";
// import { PushPage } from "@/utils/message";
import router from "../router";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
// import qs from "qs";
import { showLoading, hideLoading } from "@/components/loading/loading";
// const loadingSetting = {
//   fullscreen: true
// };
// myLoading = this.$loading(loadingSetting);
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // myLoading = this.$loading(loadingSetting);
    const { notShowLoading } = config.data || false;
    // config.data = qs.stringify(config.data);
    config.headers["Content-Type"] = "application/json;";
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();

      // Date.parse(new Date()) 精确到秒的时间戳
      // new Date().getTime() 精确到毫秒的时间戳
      // process.env.VUE_APP_FLAG  配置的口令
      // (Math.random() * 1e16)  随机数
      config.headers["time"] = new Date().getTime();
      config.headers["random"] = Math.random() * 1e16;
      const sign = new Date().getTime() + Math.random() * 1e16 + process.env.VUE_APP_FLAG;
      // console.log(sign, that)
      config.headers["sign"] = that.$md5(sign).toUpperCase();
    }
    // console.log(store.getters.account);
    if (!notShowLoading) {
      showLoading();
    }
    config.data = JSON.stringify(config.data);
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
var signInFlag = false;
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  (response) => {
    // myLoading.close();
    hideLoading();
    const res = response.data;
    if (res.code !== 200) {
      if (res.code === 414 && !signInFlag) {
        // 过期
        signInFlag = true;
        const stylediv = "width: 90%;margin-bottom: 35px;";
        const styleInput =
          "-webkit-appearance: none;height: 36px;line-height: 36px;background-color: #fff;background-image: none;border-radius: 4px;border: 1px solid #dcdfe6;box-sizing: border-box;color: #606266;display: inline-block;font-size: inherit;outline: none;padding: 0 15px;transition: border-color .2s cubic-bezier(.645,.045,.355,1);width: calc( 100% - 65px) ;";
        MessageBox.confirm(
          `<div style="${stylediv}">账号：<div style="${styleInput};text-align:left"  >${res.username}</div></div>` +
            `<div style="${stylediv}">密码：<input placeholder="请输入密码" type = "password" id="possword" prefix-icon="el-icon-search"  style="${styleInput}"></input></div>`,
          "身份登录已过期，是否重新登录",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "退出登录",
            customClass: "confirm50Class whlogin",
            dangerouslyUseHTMLString: true,
            center: true,
            showClose: false,
            closeOnClickModal: false,
          }
        )
          .then(({ value }) => {
            var obj = document.getElementById("possword");
            store
              .dispatch("user/login", {
                account: res.username,
                password: obj.value,
              })
              .then(() => {
                obj.value = "";
              });
          })
          .catch(() => {
            location.reload();
          });
      } else if (res.code === 415) {
        // 未登录
        Message.error("当前用户未登录，或登录状态丢失!");
        removeToken();
        router.push({ path: "/login" });
      } else {
        const msg =
          "请求失败" +
          "</br></br>" +
          "错误码：" +
          res.code +
          "</br></br>" +
          "错误提示：" +
          res.msg;
        Message({
          dangerouslyUseHTMLString: true,
          message: msg,
          type: "error",
          duration: 5 * 1000,
          showClose: true,
        });
      }

      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      signInFlag = false;
      return res;
    }
  },
  (error) => {
    hideLoading();
    console.log("err" + error); // for debug
    if (error.response.status === 403) {
      const msg =
        "交易错误" +
        "</br></br>" +
        "错误码：" +
        error.response.status +
        "</br></br>" +
        "错误提示：" +
        error.message;
      Message({
        dangerouslyUseHTMLString: true,
        message: msg,
        type: "error",
        duration: 5 * 1000,
        showClose: true,
      });
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
