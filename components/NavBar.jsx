import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NavBar() {
	const navigation = useNavigation();

	const handleHome = () => {
		navigation.navigate("Home");
	};

	const handleGoal = () => {
		navigation.navigate("Goal");
	};

	const handleProgress = () => {
		navigation.navigate("Activity");
	};

	return (
		<View style={styles.bottomNav}>
			<TouchableOpacity style={styles.navItem} onPress={handleHome}>
				<Text style={styles.navText}>Home</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.navItem} onPress={handleGoal}>
				<Text style={styles.navText}>Meta</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.navItem} onPress={handleProgress}>
				<Text style={styles.navText}>Act</Text>
			</TouchableOpacity>
		</View>
	);
}

export const styles = StyleSheet.create({
	bottomNav: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 30,
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
