import axios from 'axios';

// const axiosInstance = axios.create();
const axiosInstance = axios.create({
  baseURL: `http://localhost:8000/track_down`
})
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;
