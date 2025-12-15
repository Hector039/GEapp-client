import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 5000,
});

axiosInstance.interceptors.request.use(
	async function (config) {
		const user = await AsyncStorage.getItem("user");
		const token = user ? JSON.parse(user).token : null;
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

export default axiosInstance;
