import { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	StatusBar,
	Button,
} from "react-native";
import { checkLoginStatus } from "../../tools/checkLoginStatus";
import { useNavigation } from "@react-navigation/native";
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import Logo from "../../assets/geLogo01.svg";
import { globalStyles } from "../../stylesConstants";
import HeaderBackground from "./assets/headerBackground.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignLoginScreen() {
	const navigation = useNavigation();
	const [signupMode, setSignupMode] = useState(true);
	const toggleSignInMode = () => setSignupMode(!signupMode);

	async function checkLoginStatusWrapper() {
		const isLogged = await checkLoginStatus();
		if (isLogged) navigation.navigate("MainTabs", { screen: "Home" });
	}

	useEffect(() => {
		checkLoginStatusWrapper();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#FBFBFB" }}>
			<StatusBar barStyle="dark-content" backgroundColor="black" />

			<HeaderBackground
				style={styles.headerBg}
				width={"100%"}
				height={180}
				preserveAspectRatio="xMidYMin slice"
			/>

			<SafeAreaView style={styles.safe}>
				<Logo style={styles.logo} />
				<Text style={styles.title}>
					{signupMode ? "Bienvenido" : "Crear cuenta"}
				</Text>

				{signupMode ?
					<Login />
				:	<SignIn />}

				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={toggleSignInMode} style={styles.button}>
						<Text style={styles.buttonText}>
							{signupMode ? "Crear cuenta" : "Inicia sesión"}
						</Text>
					</TouchableOpacity>
				</View>

				{/* botón SOLO PARA DESAROLLO Y PRUEBAS */}
				{/* <Button
					title="Reset Storage"
					onPress={async () => {
						await AsyncStorage.removeItem("user");
						await AsyncStorage.removeItem("userAvatarPath");
						await AsyncStorage.removeItem("userSteps");
						await AsyncStorage.removeItem("streak");
						await AsyncStorage.removeItem("tracker");
						await AsyncStorage.removeItem("startCountingSteps");
						await AsyncStorage.removeItem("endCountingSteps");
						await AsyncStorage.removeItem("isRemembered");
						await AsyncStorage.removeItem("userEmail");
						await AsyncStorage.removeItem("userPassword");
						console.log("Storage limpio");
					}}
				/> */}
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	headerBg: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1,
	},
	logo: {
		width: 180,
		height: 180,
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.xlarge,
		color: globalStyles.colors.tertiary,
	},
	buttonContainer: {
		backgroundColor: globalStyles.colors.primary,
		width: "100%",
		height: 100,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	button: {
		backgroundColor: "#FBFBFB",
		borderRadius: 25,
		borderColor: globalStyles.colors.tertiary,
		borderWidth: 2,
		width: "85%",
		alignItems: "center",
	},
	buttonText: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaSemiBold",
		fontSize: globalStyles.fSizes.medium,
		paddingBlock: 15,
	},
});
