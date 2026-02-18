import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../../context/UserContext.js";
import { globalStyles } from "../../../stylesConstants.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout() {
	const { logout } = useUser();

	async function handleLogout() {
		/* await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("token");
		setIsUserLoggedIn(false); */
		logout();
	}

	return (
		<TouchableOpacity onPress={handleLogout}>
			<Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	logoutButtonText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: globalStyles.colors.tertiary,
		paddingVertical: 10,
		paddingLeft: 20,
	},
});
