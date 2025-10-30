import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { checkLoginStatus } from "../../tools/checkLoginStatus";
import { useNavigation } from "@react-navigation/native";
import Login from "./components/Login";
import SignIn from "./components/SignIn";

export default function SignLoginScreen() {
	const navigation = useNavigation();
	const [signupMode, setSignupMode] = useState(true);
	const toggleSignInMode = () => setSignupMode(!signupMode);

	async function checkLoginStatusWrapper() {
		const isLogged = await checkLoginStatus();
		if (isLogged) navigation.navigate("Home");
	}

	useEffect(() => {
		checkLoginStatusWrapper();
	}, []);

	return (
		<View style={styles.container}>
			{signupMode ?
				<Login />
			:	<SignIn />}
			<View style={styles.signUpModeContainer}>
				<TouchableOpacity onPress={toggleSignInMode}>
					<Text>{signupMode ? "Crear cuenta" : "Inicia sesión"}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
	signUpModeContainer: {
		flexDirection: "row",
		marginBottom: 50,
	},
});
