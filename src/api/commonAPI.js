import axios from "axios";
//根据道路名获取道路线点位
const getRoadLine = (data, { host, token }) => {
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
      .catch(error => {
        console.log(error);
      });
  });
};

/**
 * 推送点位数据
 */
const sendPointData = (params, { host, token }) => {
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
      .catch(error => {
        console.log(error, params);
        reject(error);
      });
  });
};

//获取全国城市列表（内置城市中心点）
const initCityList = async () => {
  return axios.get("./location.json").then(res => {
    return res.data;
  });
};

//通过mapserver获取XML文件
const getXmlByMapServer = (url, params) => {
  return axios
    .get(url.trim(), { params })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

export { getRoadLine, sendPointData, initCityList, getXmlByMapServer };
