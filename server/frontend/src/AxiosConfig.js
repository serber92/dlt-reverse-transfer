/* eslint-disable no-undef */
/* eslint-disable no-empty */
import axios from 'axios';

class AxiosConfig {
  static init() {
    axios.interceptors.request.use(config => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.common["x-access-token"] = token;
        }
        
      } catch (error) {

      }

      return config;
    });

    axios.interceptors.request.use(null, error => {
      return Promise.reject(error);
    });
  }
}

export default AxiosConfig;
