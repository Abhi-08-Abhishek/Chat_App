import axios from "axios";

// instence of axios

export const axiosInstance = axios.create({
// valify the backend when we in development mode then use url either in production then user /api
  baseURL:"http://localhost:3000/api",
  timeout: 5000,
  withCredentials: true,  // credential is true to share cookies

});