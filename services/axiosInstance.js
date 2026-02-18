import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
	async function (config) {
		const token = await AsyncStorage.getItem("token");
		if (JSON.parse(token) !== null) {
			config.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

export default axiosInstance;
