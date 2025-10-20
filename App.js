import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignLoginScreen from "./screens/SignLoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PassRestorationScreen from "./screens/PassRestorationScreen";
import { UserProvider } from "./context/UserContext.js";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<UserProvider>
			<NavigationContainer>
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
						name="Home"
						component={HomeScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</UserProvider>
	);
}
