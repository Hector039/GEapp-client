import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext(undefined);

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";
const USER_AVATAR_PATH_KEY = "userAvatarPath";
const USER_STEPS_KEY = "userSteps";
const USER_SESSION_STEPS_KEY = "userSessionSteps";
const ORG_EVENT_KEY = "orgEvent";
const ORG_EVENT_STEPS_KEY = "orgEventSteps";
const PROJECT_KEY = "project";
const PROJECT_GOAL_STEPS_KEY = "projectGoalSteps";

export const UserProvider = ({ children }) => {
	const [user, setUserState] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userAvatar, setUserAvatarState] = useState(null);
	const [orgEvent, setOrgEventState] = useState(null);
	const [project, setProjectState] = useState(null);
	const [steps, setStepsState] = useState(0);
	const [sessionSteps, setSessionStepsState] = useState(0);
	const [subscriptionState, setSubcriptionState] = useState(false);
	const [orgEventSteps, setOrgEventStepsState] = useState(0);
	const [projectGoalSteps, setProjectGoalStepsState] = useState(0);

	// Función para guardar el usuario en el estado y en el storage
	const setUser = async (userData) => {
		if (userData) {
			await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
			await AsyncStorage.setItem(
				TOKEN_STORAGE_KEY,
				JSON.stringify(userData.token),
			);
			setIsLoggedIn(true);
		} else {
			await AsyncStorage.removeItem(USER_STORAGE_KEY);
			await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
			setIsLoggedIn(false);
		}
		setUserState(userData);
	};

	const setOrgEvent = async (orgData) => {
		if (orgData) {
			await AsyncStorage.setItem(ORG_EVENT_KEY, JSON.stringify(orgData));
		} else {
			await AsyncStorage.removeItem(ORG_EVENT_KEY);
		}
		setOrgEventState(orgData);
	};

	const setProject = async (projectData) => {
		if (projectData) {
			await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(projectData));
		} else {
			await AsyncStorage.removeItem(PROJECT_KEY);
		}
		setUsesetProjectStaterState(projectData);
	};

	const setUserAvatar = async (userAvatarPath) => {
		if (userAvatarPath) {
			await AsyncStorage.setItem(
				USER_AVATAR_PATH_KEY,
				JSON.stringify(userAvatarPath),
			);
		} else {
			await AsyncStorage.removeItem(USER_AVATAR_PATH_KEY);
		}
		setUserAvatarState(userAvatarPath);
	};

	const setProjectGoalSteps = async (projectGoalSteps) => {
		if (projectGoalSteps) {
			await AsyncStorage.setItem(
				PROJECT_GOAL_STEPS_KEY,
				JSON.stringify(projectGoalSteps),
			);
		} else {
			await AsyncStorage.removeItem(PROJECT_GOAL_STEPS_KEY);
		}
		setProjectGoalStepsState(projectGoalSteps);
	};
	const loadProjectGoalSteps = async () => {
		try {
			const storedProjectGoalSteps = await AsyncStorage.getItem(
				PROJECT_GOAL_STEPS_KEY,
			);
			if (storedProjectGoalSteps) {
				setProjectGoalStepsState(JSON.parse(storedProjectGoalSteps));
			}
		} catch (error) {
			console.error("Error cargando el goal steps desde AsyncStorage:", error);
		}
	};

	const setOrgEventSteps = async (orgSteps) => {
		if (orgSteps) {
			await AsyncStorage.setItem(ORG_EVENT_STEPS_KEY, JSON.stringify(orgSteps));
		} else {
			await AsyncStorage.removeItem(ORG_EVENT_STEPS_KEY);
		}
		setOrgEventStepsState(orgSteps);
	};

	const loadOrgEventSteps = async () => {
		try {
			const storedOrgEventSteps = await AsyncStorage.getItem(ORG_EVENT_STEPS_KEY);
			if (storedOrgEventSteps) {
				setOrgEventStepsState(JSON.parse(storedOrgEventSteps));
			}
		} catch (error) {
			console.error(
				"Error cargando los pasos del evento desde AsyncStorage:",
				error,
			);
		}
	};

	const setSteps = async (userSteps) => {
		if (userSteps) {
			await AsyncStorage.setItem(USER_STEPS_KEY, JSON.stringify(userSteps));
		} else {
			await AsyncStorage.removeItem(USER_STEPS_KEY);
		}
		setStepsState(userSteps);
	};

	const setSessionSteps = async (sessionSteps) => {
		if (sessionSteps) {
			await AsyncStorage.setItem(
				USER_SESSION_STEPS_KEY,
				JSON.stringify(sessionSteps),
			);
		} else {
			await AsyncStorage.removeItem(USER_SESSION_STEPS_KEY);
		}
		setSessionStepsState(sessionSteps);
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
				error,
			);
		}
	};

	const loadUserSteps = async () => {
		try {
			const storedUserSteps = await AsyncStorage.getItem(USER_STEPS_KEY);
			if (storedUserSteps) {
				setStepsState(JSON.parse(storedUserSteps));
			}
		} catch (error) {
			console.error(
				"Error cargando los pasos del usuario desde AsyncStorage:",
				error,
			);
		}
	};

	const loadUserSessionSteps = async () => {
		try {
			const storedUserSessionSteps = await AsyncStorage.getItem(
				USER_SESSION_STEPS_KEY,
			);
			if (storedUserSessionSteps) {
				setSessionStepsState(JSON.parse(storedUserSessionSteps));
			}
		} catch (error) {
			console.error(
				"Error cargando los pasos de la sesión de usuario desde AsyncStorage:",
				error,
			);
		}
	};

	const loadOrgEvent = async () => {
		try {
			const storedOrgEvent = await AsyncStorage.getItem(ORG_EVENT_KEY);
			if (storedOrgEvent) {
				setOrgEventState(JSON.parse(storedOrgEvent));
			}
		} catch (error) {
			console.error(
				"Error cargando los los datos del evento desde AsyncStorage:",
				error,
			);
		}
	};

	const loadProject = async () => {
		try {
			const storedProject = await AsyncStorage.getItem(PROJECT_KEY);
			if (storedProject) {
				setProjectState(JSON.parse(storedProject));
			}
		} catch (error) {
			console.error(
				"Error cargando los los datos del proyecto desde AsyncStorage:",
				error,
			);
		}
	};

	const checkLoginStatus = async () => {
		try {
			const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
			if (!token) {
				setIsLoggedIn(false);
				return;
			}

			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;

			if (decoded.exp && decoded.exp < currentTime) {
				setIsLoggedIn(false);
			} else {
				setIsLoggedIn(true);
			}
		} catch (error) {
			console.error("Error validando token:", error);
			setIsLoggedIn(false);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem(USER_STORAGE_KEY);
		await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
		setUser(null);
	};

	useEffect(() => {
		loadUser();
		loadUserAvatar();
		loadUserSteps();
		loadOrgEvent();
		loadProject();
		checkLoginStatus();
		loadUserSessionSteps();
		loadProjectGoalSteps();
		loadOrgEventSteps();
	}, []);

	const value = {
		user,
		setUser,
		userAvatar,
		setUserAvatar,
		setSteps,
		steps,
		subscriptionState,
		setSubcriptionState,
		setOrgEvent,
		setProject,
		orgEvent,
		project,
		isLoggedIn,
		logout,
		sessionSteps,
		setSessionSteps,
		orgEventSteps,
		setOrgEventSteps,
		projectGoalSteps,
		setProjectGoalSteps,
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
