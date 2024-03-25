import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from "../config";

const { api } = config;

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const authUser: any = localStorage.getItem("authUser")
const token = authUser;
if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
// axios.interceptors.response.use(
//   function (response) {
//     return response.data ? response.data : response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     let message;
//     switch (error.status) {
//       case 500:
//         message = "Internal Server Error";
//         break;
//       case 401:
//         message = "Invalid credentials";
//         break;
//       case 404:
//         message = "Sorry! the data you are looking for could not be found";
//         break;
//       default:
//         message = error.message || error;
//     }
//     return Promise.reject(message);
//   }
// );
axios.interceptors.request.use(
  (config) => {
    // Thực hiện các hành động bạn muốn trước khi gửi yêu cầu
    console.log('Making request to: ', config.url);
    
    // Đừng quên trả về config, nếu không yêu cầu sẽ không được gửi đi
    return config;
  },
  (error) => {
    // Xử lý lỗi trong quá trình gửi yêu cầu
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    // Thực hiện các hành động bạn muốn sau khi nhận được phản hồi
    console.log('Response received: ', response.data);
    
    // Đừng quên trả về response, nếu không phản hồi sẽ không được xử lý tiếp
    return response.data;
  },
  (error) => {
    // Xử lý lỗi trong quá trình nhận phản hồi
    return Promise.reject(error);
  }
);
/**
 * 
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token : string) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from the given URL
   */
  get = (url: string, params?: any): Promise<AxiosResponse> => {
    let response: Promise<AxiosResponse>;

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  /**
   * Posts the given data to the URL
   */
  create = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.post(url, data);
  };
  createFile =  (url: string, data: FormData): Promise<AxiosResponse> => {
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data' // Thiết lập Content-Type là multipart/form-data
      }
    });
  };
  /**
   * Updates data
   */
  update = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.patch(url, data);
  };

  put = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return axios.delete(url, { ...config });
  };
}
const isGreaterThanCurrentTime = (inputTime: string | null): boolean => {
  if (inputTime != null) {
    // Tạo một đối tượng Date từ chuỗi thời gian đầu vào
    const [time, date] = inputTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const [day, month, year] = date.split('-');
    const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
console.log(inputDate)
    // Tạo một đối tượng Date đại diện cho thời gian hiện tại
    const currentTime = new Date();
    console.log(currentTime)
    // So sánh thời gian đầu vào với thời gian hiện tại
    return inputDate.getTime() > currentTime.getTime();
  } else {
    return false;
  }
};

const getLoggedinUser = () => {
var timeExpire:string|null=localStorage.getItem("timeExpire");

const timeExpireLocal=isGreaterThanCurrentTime(timeExpire);
console.log(timeExpire)
  const user = localStorage.getItem("authUser");
  if (timeExpireLocal &&user ) {
    return user;
  } else {
    return null;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };