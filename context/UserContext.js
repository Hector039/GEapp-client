import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userAvatar, setUserAvatar] = useState(null);

	async function logout() {
		await AsyncStorage.removeItem("user");
		setUser(null);
	}

	return (
		<UserContext.Provider
			value={{ user, logout, setUser, userAvatar, setUserAvatar }}
		>
			{children}
		</UserContext.Provider>
	);
}
