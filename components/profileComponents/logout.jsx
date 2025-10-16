import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { UserContext } from "../../context/UserContext.js";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Logout() {
	const navigation = useNavigation();
	const { logout } = useContext(UserContext);

	function handleLogout() {
		logout();
		navigation.reset({
			index: 0,
			routes: [{ name: "SignLogin" }],
		});
	}

	return (
		<TouchableOpacity style={styles.container} onPress={handleLogout}>
			<Text>Cerrar Sesión</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		paddingBlock: 10,
		alignItems: "center",
		backgroundColor: "#f89d9dff",
		width: "90%",
	},
});
