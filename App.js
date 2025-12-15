import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignLoginScreen from "./screens/SignLogin/SignLoginScreen.jsx";
import PassRestorationScreen from "./screens/SignLogin/PassRestorationScreen.jsx";
import { UserProvider } from "./context/UserContext.js";
import TicScreen from "./screens/SignLogin/TicScreen.jsx";
import TriviaScreen from "./screens/TriviaScreen/TriviaScreen.jsx";
import OnboardingScreen from "./screens/Onboarding/OnboardingScreen.jsx";

import TabNavigator from "./TabNavigator.js";

import { loadFonts } from "./hooks/useFonts.js";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		async function load() {
			await loadFonts();
			setFontsLoaded(true);
		}
		load();
	}, []);

	if (!fontsLoaded) return <ActivityIndicator size="large" />;

	return (
		<NavigationContainer>
			<UserProvider>
				<Stack.Navigator initialRouteName="SignLogin">
					<Stack.Screen
						name="SignLogin"
						component={SignLoginScreen}
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
					<Stack.Screen
						name="Onboarding"
						component={OnboardingScreen}
						options={{ headerShown: false }}
					/>
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
				</Stack.Navigator>
			</UserProvider>
		</NavigationContainer>
	);
}
