import axios from "axios";

const baseURL = "localhost";

export const http = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  headers: {
    token: "adadad",
  },
});

//请求拦截器
http.interceptors.request.use(
  (config) => {
    // 发送请求前处理
    return config;
  },
  (error) => {
    //请求错误处理
    return Promise.reject(error);
  }
);

//响应拦截器
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error);
  }
);
