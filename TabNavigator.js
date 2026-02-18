import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavBar from "./components/NavBar";
import HomeScreen from "./screens/Home/HomeScreen.jsx";
import ActivityScreen from "./screens/Activity/ActivityScreen.jsx";
import ProjectScreen from "./screens/Project/ProjectScreen.jsx";
import ChallengesScreen from "./screens/Challenges/ChallengesScreen.jsx";
import ProfileScreen from "./screens/Profile/ProfileScreen.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	return (
		<SafeAreaView style={styles.container}>
			<Tab.Navigator
				tabBar={(props) => <NavBar {...props} />}
				screenOptions={{
					headerShown: false,
				}}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Project" component={ProjectScreen} />
				<Tab.Screen name="Activity" component={ActivityScreen} />

				<Tab.Screen
					name="Challenges"
					component={ChallengesScreen}
					options={{
						// Esto es clave: Oculta el botón/ícono de la pestaña en la NavBar
						tabBarButton: () => null,
						// Opcional: Oculta el label por si acaso
						tabBarLabel: () => null,
					}}
				/>
				<Tab.Screen
					name="Profile"
					component={ProfileScreen}
					options={{ tabBarButton: () => null, tabBarLabel: () => null }}
				/>
			</Tab.Navigator>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
