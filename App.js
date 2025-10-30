import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignLoginScreen from "./screens/SignLogin/SignLoginScreen.jsx";
import HomeScreen from "./screens/Home/HomeScreen.jsx";
import ProfileScreen from "./screens/Profile/ProfileScreen.jsx";
import PassRestorationScreen from "./screens/SignLogin/PassRestorationScreen.jsx";
import { UserProvider } from "./context/UserContext.js";
import GoalScreen from "./screens/Goal/GoalScreen.jsx";
import ActivityScreen from "./screens/Activity/ActivityScreen.jsx";
import ChallengesScreen from "./screens/Challenges/ChallengesScreen.jsx";
import TicScreen from "./screens/SignLogin/TicScreen.jsx";
import TriviaScreen from "./screens/TriviaScreen/TriviaScreen.jsx";
import ProjectScreen from "./screens/Project/ProjectScreen.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
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
						name="Home"
						component={HomeScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Challenges"
						component={ChallengesScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Activity"
						component={ActivityScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Trivia"
						component={TriviaScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Goal"
						component={GoalScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Project"
						component={ProjectScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</UserProvider>
		</NavigationContainer>
	);
}
