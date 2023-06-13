import axios from "axios";
import config from "../../../public/config.json";
let baseURL = config.baseApi
axios.defaults.timeout = 8000;//设置超时时间，单位毫秒
axios.defaults.retry = 3; //设置全局请求次数
axios.defaults.retryDelay = 1000;//设置全局请求间隙

// http 响应拦截器
axios.interceptors.response.use((response) => {
  return response
}, error => {
  var config = error.config;
  if (!config || !config.retry) return Promise.reject(error);
  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= config.retry) {
    alert('请求异常：' + error.message + '!')
    return Promise.reject(error);
  }

  config.__retryCount++;

  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  return backoff.then(function () {
    return axios(config);
  });
})
function defaultGet(url, d) {
  let data = new Object()
  if (d) data = d
  data.axiosTime = new Date().getTime()
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: data,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function get(url, d) {
  let data = new Object()
  if (d) data = d
  data.axiosTime = new Date().getTime()
  return new Promise((resolve, reject) => {
    axios
      .get(baseURL + url, {
        params: data,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + url, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function getCourseList(name) {
  let data = new Object()
  data.axiosTime = new Date().getTime()
  return new Promise((resolve, reject) => {
    axios
      .get('./static/json/course/' + name + '.js', {
        params: data,
      })
      .then((res) => {
        if (res && res.data) {
          let list = []
          let arr1 = res.data.mouduleList
          let arr2 = res.data.courseList
          let arr3 = res.data.sectionList
          for (let a = 0; a < arr1.length; a++) {
            arr1[a].children = []
            for (let b = 0; b < arr2.length; b++) {
              if (arr2[b].mouduleId == arr1[a].mouduleId) {
                arr2[b].children = []
                for (let c = 0; c < arr3.length; c++) {
                  if (arr3[c].courseId == arr2[b].courseId) {
                    arr2[b].children.push(arr3[c])
                  }
                }
                arr1[a].children.push(arr2[b])
              }
            }
            list.push(arr1[a])
          }
          resolve({
            code: 200,
            msg: 'success',
            data: list
          });
        } else {
          resolve({
            code: 100,
            msg: 'err',
            data: null
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export default {
  defaultGet,
  get,
  post,
  getCourseList
};
