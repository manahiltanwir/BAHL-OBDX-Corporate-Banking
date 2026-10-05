import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

const instance = axios.create({
  baseURL: 'http://10.90.92.89:49500', // server
  // baseURL: 'http://10.200.131.179:49500', // local
  timeout: 100000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config: any) {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

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

instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    
    const originalRequest = error.config

    if (error.response && error.response.data?.error_code === 'INVALID_REQUEST' && !originalRequest._retry) {
      
      originalRequest._retry = true

      try {
        
        const refreshResponse = await axios.post(
          `${originalRequest.baseURL}/auth-server/auth/refreshAccessToken?${
            authConfig.refreshTokenKeyName
          }=${window.localStorage.getItem(authConfig.refreshTokenKeyName)}`,
          {},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
            }
          }
        )
        
        const newAccessToken = refreshResponse.data.accessToken
        const newRefreshToken = refreshResponse.data.refreshToken

        window.localStorage.setItem(authConfig.storageTokenKeyName, newAccessToken)
        window.localStorage.setItem(authConfig.refreshTokenKeyName, newRefreshToken)

        originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`
        
        return instance(originalRequest)
      } catch (refreshError) {

        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.localStorage.removeItem(authConfig.refreshTokenKeyName)
        window.location.href = '/login'

        return new Promise(() => {})
      }
    }
    
    return Promise.reject(error)
  }
)

export default instance
