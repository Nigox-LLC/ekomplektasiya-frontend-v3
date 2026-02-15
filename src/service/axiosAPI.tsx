import axios from "axios";

const axiosAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: {
    encode: (param: string | number) => param,
  },
});

axiosAPI.interceptors.request.use(config => {
  const token = localStorage.getItem("v3_ganiwer");
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

export { axiosAPI };