import request from "../utils/request";

export default {
  // 获取会员列表数据
  getList() {
    return request({
      url: "/member/list",
      method: "get"
    });
  },
  // 分页搜素方法
  // page 当前页码  size每页查询的条数 searchMap 条件查询的条件值
  search(page, size, searchMap) {
    return request({
      url: `/member/list/search/${page}/${size}`,
      method: "post",
      params: searchMap
    });
  },
  add(pojo) {
    return request({
      url: "/member",
      method: "post",
      params: pojo
    });
  },
  getById(id) {
    return request({
      url: `/member/${id}`,
      method: "get"
    });
  },
  updated(pojo) {
    return request({
      url: `/member/${pojo.id}`,
      method: "put",
      params: pojo
    });
  },
  deleteById(id) {
    return request({
      url: `/member/${id}`,
      method: "delete"
    });
  }
};
