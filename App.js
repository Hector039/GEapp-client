import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import SignLoginScreen from "./screens/SignLogin/SignLoginScreen.jsx";
import PassRestorationScreen from "./screens/SignLogin/PassRestorationScreen.jsx";
import { UserProvider, useUser } from "./context/UserContext.js";
import TicScreen from "./screens/SignLogin/TicScreen.jsx";
import TriviaScreen from "./screens/TriviaScreen/TriviaScreen.jsx";
import OnboardingScreen from "./screens/Onboarding/OnboardingScreen.jsx";

import TabNavigator from "./TabNavigator.js";

import { loadFonts } from "./hooks/useFonts.js";
import { useEffect } from "react";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { ActivityIndicator, Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as BackgroundTask from "expo-background-task";
// import { getStepsAndroid } from "./services/getStepsAndroid.js";

const Stack = createNativeStackNavigator();
const LOCATION_TASK_NAME = "background-pedometer-task";

// Definimos la tarea
if (Platform.OS === "android") {
	TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
		if (error) {
			console.error(error);
			return;
		}

		const endTimeStr = await AsyncStorage.getItem("automated_end_time");
		if (endTimeStr) {
			const endTime = parseInt(endTimeStr, 10);
			if (Date.now() > endTime) {
				// Si ya pasó la hora, nos auto-detenemos
				console.log("Auto-deteniendo por límite de tiempo alcanzado");
				await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
				await AsyncStorage.removeItem("automated_end_time");
				await AsyncStorage.removeItem("start_time");
				return;
			}
		}

		// No necesitamos hacer nada con 'data' (la ubicación),
		// el simple hecho de que esta tarea corra mantiene vivo el proceso
		// para que Pedometer.watchStepCount siga funcionando en el componente.
		console.log("Manteniendo app viva en segundo plano...");
	});
}

function RootNavigator() {
	const { isLoggedIn } = useUser();

	return (
		<Stack.Navigator>
			{
				isLoggedIn ?
					// --- STACK PRIVADO ---
					<>
						<Stack.Screen
							name="MainTabs"
							component={TabNavigator}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Trivia"
							component={TriviaScreen}
							options={{ headerShown: false }}
						/>
					</>
					// --- STACK PÚBLICO ---
				:	<>
						<Stack.Screen
							name="SignLogin"
							component={SignLoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Onboarding"
							component={OnboardingScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="PasswordRestoration"
							component={PassRestorationScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Tic"
							component={TicScreen}
							options={{ headerShown: false }}
						/>
					</>

			}
		</Stack.Navigator>
	);
}

export default function App() {
	//const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		async function load() {
			await loadFonts();
			//setFontsLoaded(true);
		}
		load();
	}, []);

	//if (!fontsLoaded) return <ActivityIndicator size="large" />;

	return (
		<NavigationContainer>
			<UserProvider>
				<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
				<RootNavigator />
			</UserProvider>
		</NavigationContainer>
	);
}
