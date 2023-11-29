import axios from 'axios';

// const axiosInstance = axios.create();
const axiosInstance = axios.create({
  baseURL: `https://tracking-backend-sooty.vercel.app/track_down`
})
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;
