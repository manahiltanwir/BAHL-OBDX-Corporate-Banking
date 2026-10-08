import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

function getCookie(name: any): any | null {
  const nameEQ = encodeURIComponent(name) + '='
  const ca = document.cookie.split(';')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()

    // Check if this cookie string starts with the name we want
    if (c.indexOf(nameEQ) === 0) {
      // Decode and return the cookie value
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }
  return null
}

function setCookie(name: string, value: any, daysToLive: Number) {
  // Encode the value to handle special characters safely
  let cookieString
  if (name == 'accessToken' || name == 'refreshToken') {
    cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value)
  } else {
    
    cookieString = name + '=' + JSON.stringify(value)
  }

  if (daysToLive) {
    cookieString += '; max-age=' + 1 * 24 * 60 * 60
  }
  cookieString += '; path=/; SameSite=Lax'

  document.cookie = cookieString
}

  function removeCookie(name: string) {
    document.cookie = encodeURIComponent(name) + '=; max-age=0; path=/; SameSite=Lax'
  }

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
  const storedToken = getCookie(authConfig.storageTokenKeyName)!

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
          `${originalRequest.baseURL}/auth-server/auth/refreshAccessToken?${authConfig.refreshTokenKeyName}=${getCookie(
            authConfig.refreshTokenKeyName
          )}`,
          {},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getCookie(authConfig.storageTokenKeyName)}`
            }
          }
        )

        const newAccessToken = refreshResponse.data.accessToken
        const newRefreshToken = refreshResponse.data.refreshToken

        setCookie(authConfig.storageTokenKeyName, newAccessToken, 1)
        setCookie(authConfig.refreshTokenKeyName, newRefreshToken, 1)

        originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        sessionStorage.removeItem('userData')
        removeCookie(authConfig.storageTokenKeyName)
        removeCookie(authConfig.refreshTokenKeyName)
        window.location.href = '/login'

        return new Promise(() => {})
      }
    }
    return Promise.reject(error)
  }
)

export default instance
