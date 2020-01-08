import {
  getToken,
  setToken,
  getUser,
  setUser,
  removeToken
} from "@/utils/auth";
import { login, getUserInfo, logout } from "@/api/login";

const user = {
  state: {
    token: getToken(),
    user: getUser()
  },
  // 传递值
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token);
    },
    SET_USER(state, user) {
      state.user = user;
      setUser(user);
    }
  },
  // 业务逻辑
  actions: {
    Login({ commit }, form) {
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password)
          .then(response => {
            // console.log("huoqu");
            const resp = response.data;
            commit("SET_TOKEN", resp.data.token);
            //通知组件已经将token更新成功
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const respUser = response.data;
            console.log("user呢", respUser);
            commit("SET_USER", respUser.data);
            resolve(respUser);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", "");
            commit("SET_USER", null);
            removeToken();
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  modules: {}
};
export default user;
