import request from "../utils/request";

export function login(username, password) {
  return request({
    // url: '/api/login',
    url: "/user/login",
    method: "post",
    params: {
      // userName: username,
      username,
      password
    }
  });
}

export function getUserInfo(token) {
  return request({
    url: `/user/info/${token}`,
    method: "get"
  });
}

export function logout(token) {
  return request({
    url: "/user/logout",
    method: "post",
    params: {
      token
    }
  });
}
