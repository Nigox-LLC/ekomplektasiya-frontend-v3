import axios from "axios";

const axiosAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: {
    encode: (param: string | number) => param,
  },
});

export { axiosAPI };