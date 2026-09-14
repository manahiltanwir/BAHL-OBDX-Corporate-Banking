
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth';

const instance = axios.create({
  baseURL: 'http://10.90.92.89:49500', // local
  // baseURL: 'http://54.145.247.199/api/v1', // live
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config: any) {

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  // Merge existing headers with the authorization header
  config.headers = {
    ...config.headers,
    ...(storedToken ? { authorization: `Bearer ${storedToken}` } : {})
  }

  return config

  // return {
  //   ...config,
  //   headers: {
  //     authorization: storedToken ? `Bearer ${storedToken}` : null,
  //   }
  // }
})

export default instance
