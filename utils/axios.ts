import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://testnet.qtum.info/api/',
});

axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { status, data } = response;
    if (status === 200) {
        return data;
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });


 export  { axiosInstance };