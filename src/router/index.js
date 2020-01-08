import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";
import Layout from "../components/Layout.vue";
import Home from "../views/home";
import Member from "../views/member";
import Supplier from "../views/supplier";
import Staff from "../views/staff";
import Goods from "../views/goods";
Vue.use(Router);

// const routes = [{
//     path: "/login",
//     name: "login",
//     component: Login //组件对象
// }, ];

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login //组件对象
    },
    {
      path: "/",
      name: "layout",
      component: Layout, //组件对象
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: Home,
          meta: { title: "首页" }
        }
      ]
    },
    {
      path: "/member",
      component: Layout,
      children: [
        {
          path: "/",
          component: Member,
          meta: { title: "会员管理" }
        }
      ]
      //   meta: { title: "会员" }
    },
    {
      path: "/supplier",
      component: Layout,
      children: [
        {
          path: "/",
          component: Supplier,
          meta: { title: "供应商管理" }
        }
      ]
      //   meta: { title: "会员" }
    },
    {
      path: "/staff",
      component: Layout,
      children: [
        {
          path: "/",
          component: Staff,
          meta: { title: "员工管理" }
        }
      ]
      //   meta: { title: "会员" }
    },
    {
      path: "/goods",
      component: Layout,
      children: [
        {
          path: "/",
          component: Goods,
          meta: { title: "商品管理" }
        }
      ]
      //   meta: { title: "会员" }
    }
  ]
});

// export default router;
