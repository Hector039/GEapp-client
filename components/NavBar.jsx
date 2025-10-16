import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Start from "./Start";

export default function NavBar() {
	const navigation = useNavigation();

	const handleHome = () => {
		navigation.navigate("Home");
	};

	const handleProgress = () => {
		navigation.navigate("Progress");
	};

	return (
		<View style={styles.bottomNav}>
			<TouchableOpacity style={styles.navItem} onPress={handleHome}>
				<Text style={styles.navText}>Home</Text>
			</TouchableOpacity>

			<Start />

			<TouchableOpacity style={styles.navItem} onPress={handleProgress}>
				<Text style={styles.navText}>Progreso</Text>
			</TouchableOpacity>
		</View>
	);
}

export const styles = StyleSheet.create({
	bottomNav: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 30,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "black",
	},
	navItem: {
		alignItems: "center",
	},
	navText: {
		color: "white",
		fontSize: 12,
	},
});
