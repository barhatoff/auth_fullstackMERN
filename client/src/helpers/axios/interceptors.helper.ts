import axios from "axios";
import { constant } from "../../constants/constant";

axios.interceptors.response.use(
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
          return axios(originalRequest);
        }
      } catch (err) {
        throw new Error("Token not valid or expired");
      }
    }

    return Promise.reject(error);
  }
);
