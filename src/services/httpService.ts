import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { triggerGlobalOtpVerification } from 'src/context/OtpContext'

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

function setCookie(name: string, value: any) {
  let cookieString
  if (name == 'accessToken' || name == 'refreshToken') {
    cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value)
  } else {
    cookieString = name + '=' + JSON.stringify(value)
  }
  cookieString += '; path=/; SameSite=Lax'

  document.cookie = cookieString
}

function removeCookie(name: string) {
  document.cookie = encodeURIComponent(name) + '=; max-age=0; path=/; SameSite=Lax'
}

const instance = axios.create({
  baseURL: 'http://10.90.92.89:49500', // INTERNAL
  // baseURL: 'http://10.205.5.96:49500', // QA  
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

    

     if (originalRequest && originalRequest._isResendRequest) {
       return Promise.reject(error)
     }

    if (getCookie(authConfig.storageTokenKeyName) && (getCookie(authConfig.refreshTokenKeyName)) && (localStorage.getItem('userData'))) {
      
      if (error.response && error.response.data?.error_code === 'OTP_REQUIRED' && !originalRequest._otpRetry) {
        originalRequest._otpRetry = true

        try {
          const finalSuccessResponse = await triggerGlobalOtpVerification(originalRequest, error)
          
          return finalSuccessResponse
        } catch (otpError) {
          
          return Promise.reject(otpError)
        }
      }
    }

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

        setCookie(authConfig.storageTokenKeyName, newAccessToken)
        setCookie(authConfig.refreshTokenKeyName, newRefreshToken)

        originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`

        return instance(originalRequest)
      } catch (refreshError) {

        

        localStorage.removeItem('userData')
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
