import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://amazon-backend-s0le.onrender.com",
});

export { axiosInstance };
