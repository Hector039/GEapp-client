import { useEffect, useState } from "react";
import {
	requestPermission,
	getSdkStatus,
	SdkAvailabilityStatus,
	initialize,
} from "react-native-health-connect";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	StatusBar,
} from "react-native";
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import Logo from "../../assets/geLogo01.svg";
import { globalStyles } from "../../stylesConstants";
import HeaderBackground from "./assets/headerBackground.svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignLoginScreen() {
	const [signupMode, setSignupMode] = useState(true);
	const toggleSignInMode = () => setSignupMode(!signupMode);
	/* 
	async function checkSensorStatus() {
		try {
			// Check SDK availability
			const status = await getSdkStatus();
			if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE)
				handleError("SDK no disponible.");
			if (
				status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
			)
				handleError("SDK no disponible, se requiere instalar Salud Connect!");

			const isInitialized = await initialize();

			if (!isInitialized) {
				handleError("El sensor de pasos no disponible en este dispositivo.");
				return;
			}

			const grantedPermissions = await requestPermission([
				{ accessType: "read", recordType: "Steps" },
			]);

			if (
				!grantedPermissions.some((permission) => permission.recordType === "Steps")
			) {
				handleError("Sin permisos concedidos por el usuario.");
				return;
			}
		} catch (error) {
			console.error(error);
		}
	}
 */

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FBFBFB" }}>
			<StatusBar barStyle="dark-content" backgroundColor="black" />

			<HeaderBackground
				style={styles.headerBg}
				width={"100%"}
				height={180}
				preserveAspectRatio="xMidYMin slice"
			/>

			<View style={styles.safe}>
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
						const userInLs = await AsyncStorage.getItem("user");
						const tokenInLs = await AsyncStorage.getItem("token");
						console.log("user in LS: ", JSON.parse(userInLs));
						console.log("token in LS: ", JSON.parse(tokenInLs));

						await AsyncStorage.removeItem("token");
						//await AsyncStorage.removeItem("user");
						// await AsyncStorage.removeItem("userAvatarPath");
						// await AsyncStorage.removeItem("userSteps");
						// await AsyncStorage.removeItem("streak");
						// await AsyncStorage.removeItem("tracker");
						// await AsyncStorage.removeItem("startCountingSteps");
						// await AsyncStorage.removeItem("endCountingSteps");
						// await AsyncStorage.removeItem("isRemembered");
						// await AsyncStorage.removeItem("userEmail");
						// await AsyncStorage.removeItem("userPassword");
						console.log("Storage limpio");
					}}
				/> */}
			</View>
		</SafeAreaView>
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
