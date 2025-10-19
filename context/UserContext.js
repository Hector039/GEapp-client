import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(undefined);

const USER_STORAGE_KEY = "user";
const USER_AVATAR_PATH_KEY = "userAvatarPath";

export const UserProvider = ({ children }) => {
	const [user, setUserState] = useState(null);
	const [userAvatar, setUserAvatarState] = useState(null);

	// Función para guardar el usuario en el estado y en el storage
	const setUser = async (userData) => {
		if (userData) {
			await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
		} else {
			await AsyncStorage.removeItem(USER_STORAGE_KEY);
		}
		setUserState(userData);
	};

	const setUserAvatar = async (userAvatarPath) => {
		if (userAvatarPath) {
			await AsyncStorage.setItem(
				USER_AVATAR_PATH_KEY,
				JSON.stringify(userAvatarPath)
			);
		} else {
			await AsyncStorage.removeItem(USER_AVATAR_PATH_KEY);
		}
		setUserAvatarState(userAvatarPath);
	};

	const Logout = async () => {
		await AsyncStorage.removeItem(USER_STORAGE_KEY);
		setUserState(null);
	};

	const loadUser = async () => {
		try {
			const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
			if (storedUser) {
				setUserState(JSON.parse(storedUser));
			}
		} catch (error) {
			console.error("Error cargando usuario desde AsyncStorage:", error);
		}
	};

	const loadUserAvatar = async () => {
		try {
			const storedUserAvatarPath =
				await AsyncStorage.getItem(USER_AVATAR_PATH_KEY);
			if (storedUserAvatarPath) {
				setUserAvatarState(JSON.parse(storedUserAvatarPath));
			}
		} catch (error) {
			console.error(
				"Error cargando el avatar del usuario desde AsyncStorage:",
				error
			);
		}
	};

	useEffect(() => {
		loadUser();
		loadUserAvatar();
	}, []);

	const value = {
		user,
		setUser,
		Logout,
		userAvatar,
		setUserAvatar,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

//custom hook
export const useUser = () => {
	const context = useContext(UserContext);

	if (context === undefined) {
		throw new Error("useUser debe ser usado dentro de un UserProvider");
	}

	return context;
};
