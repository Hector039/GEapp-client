import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SeeMoreBar({ title, destiny }) {
	const navigation = useNavigation();

	function handleSeeMore() {
		navigation.navigate(destiny);
	}

	return (
		<View style={styles.titleContainer}>
			<Text>{title}</Text>
			<View style={styles.seeMoreContainer}>
				<TouchableOpacity onPress={handleSeeMore}>
					<Text>Ver más</Text>
				</TouchableOpacity>
				<Ionicons name="arrow-forward-outline" size={25} color="#333b30ff" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "80%",
	},
	seeMoreContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
