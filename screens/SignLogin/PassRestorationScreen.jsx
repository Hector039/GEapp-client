import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { restorePassword } from "../../services/apiEndpoints.js";
import { passwordRegex, emailRegex } from "../../tools/regexConstants.js";
import CustomModal from "../../tools/CustomModal.jsx";
import CustomLightModal from "../../tools/CustomLightModal.jsx";
import Logo from "../../assets/geLogo01.svg";
import { globalStyles } from "../../stylesConstants";
import HeaderBackground from "./assets/headerBackground.svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PassRestorationScreen() {
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);

	const [error, setError] = useState("");
	const [errorModalVisible, setErrorModalVisible] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");

	const handleRestorePassword = async () => {
		try {
			if (!email || !password || !rePassword) return handleError("Faltan datos");
			if (password !== rePassword)
				return handleError("Las contraseñas no coinciden");

			if (!emailRegex.test(email))
				return handleError("Correo inválido, verifica e intenta nuevamente");
			if (!passwordRegex.test(password))
				return handleError(
					"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
				);

			try {
				const responseData = await restorePassword(email, password);
				if (responseData) setModalVisible(true);
			} catch (error) {
				handleError("Error al enviar datos de restauración");
			}
		} catch (error) {
			console.log("Login error:", error);
		}
	};

	function handleBackToLogin() {
		navigation.reset({ index: 0, routes: [{ name: "SignLogin" }] });
	}

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

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
				<Text style={styles.title}>Restaura tu contraseña</Text>

				<View style={styles.container}>
					<TextInput
						placeholder="Correo electrónico registrado"
						placeholderTextColor="#5E5D5D"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						style={styles.textInput}
					/>
					<TextInput
						placeholder="Contraseña nueva"
						placeholderTextColor="#5E5D5D"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
						style={styles.textInput}
					/>
					<TextInput
						placeholder="Confirma Contraseña nueva"
						placeholderTextColor="#5E5D5D"
						secureTextEntry
						value={rePassword}
						onChangeText={setRePassword}
						style={styles.textInput}
					/>
					<TouchableOpacity
						onPress={() => handleRestorePassword()}
						style={styles.sendButton}
					>
						<Text style={styles.sendButtonText}>Enviar</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.backButtonContainer}>
					<TouchableOpacity
						onPress={() => handleBackToLogin()}
						style={styles.backButton}
					>
						<Text style={styles.backButtonText}>Volver</Text>
					</TouchableOpacity>
				</View>

				<CustomLightModal
					visible={errorModalVisible}
					onClose={() => setErrorModalVisible(!errorModalVisible)}
					errorMessage={error}
				/>

				<CustomModal
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					title="Exito!"
					message="Por favor revisa tu email para confirmar tu nuevo password."
					backgroundColor="#e6ffe6" // Fondo verde claro
					iconName="checkmark-circle-outline"
					iconColor="green"
					buttons={[
						{
							text: "Aceptar",
							onPress: () => {
								setModalVisible(false);
								navigation.reset({
									index: 0,
									routes: [{ name: "SignLogin" }],
								});
							},
							style: { backgroundColor: "green" },
						},
					]}
				/>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		borderColor: globalStyles.colors.tertiary,
		borderWidth: 2,
		width: "85%",
		paddingBlock: 5,
	},
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
		marginBottom: 20,
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		marginBottom: 30,
	},
	textInput: {
		width: "85%",
		borderColor: globalStyles.colors.secondary,
		borderWidth: 1,
		borderRadius: 18,
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: "#5E5D5D",
		textAlign: "center",
		backgroundColor: "#80b34925",
		marginTop: 30,
	},
	sendButton: {
		width: "45%",
		borderRadius: 30,
		backgroundColor: globalStyles.colors.primary,
		marginBlock: 30,
	},
	sendButtonText: {
		color: "white",
		fontFamily: "KarlaBold",
		fontSize: globalStyles.fSizes.large,
		textAlign: "center",
		paddingBlock: 15,
	},
	backButtonContainer: {
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
	backButton: {
		backgroundColor: "#FBFBFB",
		borderRadius: 25,
		borderColor: globalStyles.colors.tertiary,
		borderWidth: 2,
		width: "85%",
		alignItems: "center",
	},
	backButtonText: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaSemiBold",
		fontSize: globalStyles.fSizes.medium,
		paddingBlock: 15,
	},
});
