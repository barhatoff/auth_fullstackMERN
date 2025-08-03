import axios from "axios";
import { constant } from "../../constants/constant";

const axiosInstance = axios.create({
  baseURL: constant.API_DOMEN,
  withCredentials: true,
  timeout: 20000,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(`${constant.API_DOMEN}auth/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = res.headers["authorization"];
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        throw new Error("Token not valid or expired");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
