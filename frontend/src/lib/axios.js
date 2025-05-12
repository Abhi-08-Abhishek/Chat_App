import axios from "axios";

// instence of axios

export const axiosInstance = axios.create({
// valify the backend when we in development mode then use url either in production then user /api
  baseURL:"https://chat-app-backend-ia1r.onrender.com/api",
  timeout: 5000,
  withCredentials: true,  // credential is true to share cookies

});
