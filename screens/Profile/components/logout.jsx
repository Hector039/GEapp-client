import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../../stylesConstants.js";

export default function Logout() {
	const navigation = useNavigation();
	const { logout } = useUser();

	function handleLogout() {
		logout();
		navigation.reset({
			index: 0,
			routes: [{ name: "SignLogin" }],
		});
	}

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		alignSelf: "center",
		marginTop: 30,
	},
	logoutButton: {
		borderRadius: 18,
		backgroundColor: globalStyles.colors.tertiary,
	},
	logoutButtonText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: "white",
		textAlign: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
});
