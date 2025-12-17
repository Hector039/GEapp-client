import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/UserContext.js";

export const checkLoginStatus = async () => {
	const { setUser, user } = useUser();
	try {
		if (user) {
			const { token } = JSON.parse(user);
			if (!token) {
				setUser(null);
				return false;
			}

			try {
				// Try to decode the token to verify it's valid
				const decoded = jwtDecode(token);
				const currentTime = Date.now() / 1000;

				// Check if token is expired
				if (decoded.exp && decoded.exp < currentTime) {
					console.log("Token expired, removing");
					setUser(null);
					return false;
				} else {
					// Token is valid
					console.log("Valid token found, user is logged in");
					return true;
				}
			} catch (error) {
				console.error("Error decoding token:", error);
				// If we can't decode the token, it's probably invalid
				setUser(null);
				return false;
			}
		}
		setUser(null);
		return false;
	} catch (err) {
		console.error("Error checking token:", err);
	}
};
