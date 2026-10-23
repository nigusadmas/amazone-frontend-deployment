import axios from "axios";

const axiosInstance = axios.create({
  // local baseUrl
  // baseURL: "http://127.0.0.1:5001/clone-9d91c/us-central1/api",

  // backend deployed version of amazon server url on render:
  baseURL: "https://amazon-backend-s0le.onrender.com/",
});

export { axiosInstance };
