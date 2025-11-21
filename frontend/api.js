// 인터셉터(Interceptor) 작성
// intercept any request that we're going to send, and automatically add the correct headers so we don't have to manually write it a bunch of different times

// axios 사용 -> axios interceptor 작성

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    // environment variable(환경변수) 안에 지정된 것을 아무거나 import 가능
    // 환경변수가 자바스크립트(리액트) 코드 안에 로딩되게 하려면 VITE 사용
    baseURL: import.meta.env.VITE_API_URL
});

/*
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) { // 토큰이 있으면
            config.headers.Authorization = `Bearer ${token}` //주의: backtick(`)
            // authorization 헤더 생성 (axios에 의해서 자동으로 다루어짐)
        }
        // 반드시 config를 반환해야 axios가 요청 설정을 이어서 처리한다
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);
*/

export default api;