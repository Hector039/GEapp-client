import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { userSignUp } from "../../../services/apiEndpoints.js";
import { useState } from "react";
import { passwordRegex, emailRegex } from "../../../tools/regexConstants.js";
import CustomModal from "../../../tools/CustomModal.jsx";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import { globalStyles } from "../../../stylesConstants";

export default function SignIn() {
	const navigation = useNavigation();

	const [error, setError] = useState("");
	const [errorModalVisible, setErrorModalVisible] = useState(false);

	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
	const [acceptTic, setAcceptTic] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");

	const handleSignIn = async () => {
		if (!email || !password || !rePassword) return handleError("Faltan datos");
		if (password !== rePassword)
			return handleError("Las contraseñas no coinciden");

		if (!emailRegex.test(email))
			return handleError("Correo inválido, verifica e intenta nuevamente");
		if (!passwordRegex.test(password))
			return handleError(
				"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
			);
		if (!acceptTic)
			return handleError("Debes aceptar los Términos y condiciones");
		try {
			const responseData = await userSignUp(email, password);
			console.log("SignIn data:", responseData);
			if (responseData) setIsSuccessModalVisible(true);
		} catch (error) {
			console.log("SignIn data error:", error.message);
			handleError(error.message || "Error de registro");
		}
	};

	const handleTic = () => {
		navigation.navigate("Tic");
	};

	const handleAcceptSwitch = () => {
		setAcceptTic(!acceptTic);
	};

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Correo electrónico"
				placeholderTextColor="#5E5D5D"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				style={styles.textInput}
			/>
			<TextInput
				placeholder="Contraseña"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={styles.textInput}
			/>
			<TextInput
				placeholder="Repetir Contraseña"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={rePassword}
				onChangeText={setRePassword}
				style={styles.textInput}
			/>
			<View style={styles.switchContainer}>
				<Switch
					trackColor={{ false: "#d8d8d8ff", true: "#67A599" }}
					thumbColor={acceptTic ? "#80B349" : "#a8a8a8ff"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={handleAcceptSwitch}
					value={acceptTic}
				/>
				<View style={styles.ticContainer}>
					<Text style={styles.ticText}>Acepto </Text>
					<TouchableOpacity onPress={() => handleTic()}>
						<Text style={styles.ticTextTerms}>TÉRMINOS Y CONDICIONES</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity
				onPress={() => handleSignIn()}
				style={styles.registerButton}
			>
				<Text style={styles.registerButtonText}>Ingresar</Text>
			</TouchableOpacity>

			<CustomLightModal
				visible={errorModalVisible}
				onClose={() => setErrorModalVisible(!errorModalVisible)}
				errorMessage={error}
			/>

			<CustomModal
				visible={isSuccessModalVisible}
				onClose={() => setIsSuccessModalVisible(false)}
				title="Bienvenido!"
				message="Por favor revisa tu email para verificar tu cuenta."
				backgroundColor="#e6ffe6"
				iconName="checkmark-circle-outline"
				iconColor={globalStyles.colors.primary}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setIsSuccessModalVisible(false);
							navigation.reset({
								index: 0,
								routes: [{ name: "SignLogin" }],
							});
						},
						style: { backgroundColor: globalStyles.colors.primary },
					},
				]}
			/>
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
		marginBlock: 20,
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
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginTop: 15,
	},
	pickerContainer: {
		backgroundColor: "transparent",
	},
	picker: {
		height: 60,
		width: 300,
		color: "black",
	},
	ticContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		gap: 10,
	},
	ticText: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaExtraBold",
		fontSize: globalStyles.fSizes.medium,
	},
	ticTextTerms: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaExtraBold",
		fontSize: globalStyles.fSizes.medium,
		textDecorationLine: "underline",
	},
	registerButton: {
		width: "45%",
		borderRadius: 30,
		backgroundColor: globalStyles.colors.primary,
		marginBlock: 30,
	},
	registerButtonText: {
		color: "white",
		fontFamily: "KarlaBold",
		fontSize: globalStyles.fSizes.large,
		textAlign: "center",
		paddingBlock: 15,
	},
});
