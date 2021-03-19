import axios from "axios";
const commonAPI = {
  //根据道路名获取道路线点位
  getRoadLine(data, { host, token }) {
    return new Promise(reslove => {
      const request = axios.create({
        baseURL: host.trim(),
        timeout: 3000,
        headers: { authorization: token }
      });
      const params = {
        adminId: data.adminId,
        keyword: data.keyword,
        pageNumber: 1,
        pageSize: 3
      };
      const url = "/search-server/back/poi/query/getRoadData";
      request
        .post(url, params)
        .then(res => {
          reslove(res);
          console.log(res);
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  },

  /**
   * 推送点位数据
   */
  sendPointData(params, { host, token }) {
    return new Promise((reslove, reject) => {
      const url = "/storage-server/storage/batchStore";
      const request = axios.create({
        baseURL: host.trim(),
        timeout: 3000,
        headers: { authorization: token }
      });
      request
        .post(url, params)
        .then(res => {
          console.log(res, params);
          reslove(res);
        })
        .catch(function(error) {
          console.log(error, params);
          reject(error);
        });
    });
  }
};
export default commonAPI;
