/*
 * @Author: xiaoning.li@inossem.com
 * @Date: 2022-08-05 09:46:25
 * @LastEditors: Danny 564382000@qq.com
 * @LastEditTime: 2022-08-05 17:32:59
 * @Description: axios 请求封装
 */
import axios from 'axios'
import { useCommonStore } from '@/store/common'

const instance = axios.create({
    baseURL: '/indata-center/', // 完整请求地址 = 当前服务域名 + baseURL + path

    timeout: 1000 * 10 * 10,
})

// 请求拦截器
instance.interceptors.request.use(
    function (config) {
        const commonStore = useCommonStore()
        config.headers && (config.headers.Authorization = commonStore.token || '')
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// token 失效处理方法
const tokenExpiredHandle = response => {
    if (response.data.returnCode === -4) {
        // todo someting when token expired
    }
}

// 响应拦截器
instance.interceptors.response.use(
    function (response) {
        tokenExpiredHandle(response)
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)
export default instance
