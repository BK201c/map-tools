import axios from "axios";
const commonAPI = {
  //根据道路名获取道路线点位
  getRoadLine(data) {
    return new Promise((reslove) => {
      const params = {
        adminId: data.adminId,
        keyword: data.keyword,
        pageNumber: 1,
        pageSize: 3,
      };
      const url = "/search-server/back/poi/query/getRoadData";
      const request = axios.create({
        baseURL: this.formBase.host,
        timeout: 3000,
        headers: { authorization: this.formBase.token },
      });
      request
        .post(url, params)
        .then((res) => {
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
  sendPointData(params) {
    const url = "/storage-server/storage/batchStore";
    const request = axios.create({
      baseURL: this.formBase.host,
      timeout: 3000,
      headers: { authorization: this.formBase.token },
    });
    request
      .post(url, params)
      .then((res) => {
        console.log(res, params);
        if (res.data.status === 200) {
          this.$message.success("数据点位推送成功", 2);
        }
      })
      .catch(function(error) {
        this.$message.error("推送失败，请重试", 2);
        console.log(error, params);
      });
  },
};
export default commonAPI;
