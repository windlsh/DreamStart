// 权限校验：
// Vue Router 中的 前置钩子函数 beforeache(to from next)

//当进行路由跳转之前  进行判断 是否已经登录 过  登录过则允许访问非登录页面 否则 回到登录页
// to 即将要进入的目标路由对象
// from  即将要离开的路由对象
// next 这是个方法 可以指定路由地址 进行路由跳转
import router from "./router";
import store from "./store";
router.beforeEach((to, from, next) => {
  // 1. 获取 token
  // const token = localStorage.getItem("lsh-msm-token");
  const token = store.state.user.token;
  console.log(token);
  //1.1 如果没有获取到 要访问非登录页面 咋不让访问 加到登录页面 /login
  if (!token) {
    if (to.path != "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      // const userInfo = localStorage.getItem("lsh-msm-user");
      const userInfo = store.state.user.user;
      if (userInfo) {
        console.log(userInfo);
        next();
      } else {
        // getUserInfo(token).then(response => {
        //   const resp = response.data;
        //   if (resp.flag) {
        //     localStorage.setItem("lsh-msm-user", JSON.stringify(resp.data));
        //     next();
        //   } else {
        //     next({ path: "/login" });
        //   }
        // });
        console.log("获取用户信息");
        store.dispatch("GetUserInfo").then(response => {
          if (response.flag) {
            next();
          } else {
            next({ path: "/login" });
          }
        });
      }
    }
  }
  // 1. 获取 token
  //1.1 如果没有获取到 要访问非登录页面 咋不让访问 加到登录页面 /login
  //1.2 获取到token
  // 1.2.1 请求路由 /login 那就去目标路由
  // 1.2.2 请求路由非登录页面 就通过token 去获取用户信息
  // 如果获取到用户信息 则进行非登录页面 否则回到到登录页面
});
