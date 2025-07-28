import axios, { AxiosError } from "axios";
import { constant } from "../../constants/constant";
import { SetError } from "../../types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const apiRequest = async (
  method: HttpMethod,
  url: string,
  setError: SetError,
  req: object | null = null
) => {
  document.body.style.cursor = "wait";
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios({
      method,
      url: constant.API_DOMEN + url,
      data: req,
      withCredentials: true,
      timeout: 20000,
      headers: accessToken ? { Authorization: accessToken } : undefined,
    })
      .then((res) => {
        if (url === "auth/login" || url === "auth/register") {
          const accessToken = res.headers["authorization"];
          localStorage.setItem("access_token", accessToken);
        }
        return res.data;
      })
      .catch((e: AxiosError) => {
        console.log(e);
        if (e.code === "ECONNABORTED") {
          console.warn("[AXIOS HELPER] Error: Timeout was reached");
          return;
        }
        if (e?.response?.status) {
          if (
            e?.response &&
            (e.response.status === 401 || e.response.status === 403) &&
            (window.location.pathname === "/login" ||
              window.location.pathname === "/register")
          )
            return;
          setError({
            message: e.response.statusText,
            code: e.response.status,
            details: e.response.data,
          });
        } else {
          setError({ message: e.message, code: e.code });
        }
        return;
      });
    return response;
  } catch (e: unknown) {
    console.log(e);
    setError({
      code: 500,
      message: "unknown problem on the our side",
      instructions: "Try later or refresh page",
    });
    return e;
  } finally {
    document.body.style.cursor = "default";
  }
};

export default async function axiosHelper<T>(
  method: HttpMethod,
  url: string,
  setError: SetError,
  req?: object | null
) {
  const response = await apiRequest(method, url, setError, req).then(
    (res) => res
  );

  if (response) return response;
}
