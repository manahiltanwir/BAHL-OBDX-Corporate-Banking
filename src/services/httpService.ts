
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth';

const instance = axios.create({
  baseURL: 'http://10.200.131.179:49500', // local
  // baseURL: 'http://54.145.247.199/api/v1', // live
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config: any) {
  
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  return {
    ...config,
    headers: {
      authorization: storedToken ? `Bearer ${storedToken}` : null,
    }
  }
})

export default instance
