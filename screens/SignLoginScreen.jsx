import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { checkLoginStatus } from "../tools/checkLoginStatus";
import { useNavigation } from "@react-navigation/native";
import Login from "../components/Login";
import SignIn from "../components/SignIn";

export default function SignLoginScreen() {
	const navigation = useNavigation();
	const [signupMode, setSignupMode] = useState(true);

	const handleHome = () =>
		navigation.reset({ index: 0, routes: [{ name: "Home" }] });
	const toggleSignInMode = () => setSignupMode(!signupMode);

	useEffect(() => {
		async function checkLoginStatusWrapper() {
			const isLogged = await checkLoginStatus();
			if (isLogged) handleHome();
		}
		checkLoginStatusWrapper();
	}, []);

	return (
		<View style={styles.container}>
			{signupMode ?
				<Login />
			:	<SignIn />}
			<View style={styles.signUpModeContainer}>
				<Text>{signupMode ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} </Text>
				<TouchableOpacity onPress={toggleSignInMode}>
					<Text>{signupMode ? "Crea una aquí" : "Inicia sesión aquí"}</Text>
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
