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

export default function SignIn() {
	const navigation = useNavigation();

	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
	const [acceptTic, setAcceptTic] = useState(false);

	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");

	const handleSignIn = async () => {
		setError("");
		if (!email || !password || !rePassword) return setError("Faltan datos");
		if (password !== rePassword) return setError("Las contraseñas no coinciden");

		if (!emailRegex.test(email))
			return setError("Correo inválido, verifica e intenta nuevamente");
		if (!passwordRegex.test(password))
			return setError(
				"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
			);
		if (!acceptTic) return setError("Debes aceptar los Términos y condiciones");
		try {
			const responseData = await userSignUp(email, password);
			console.log("SignIn data:", responseData);
			if (responseData) setIsSuccessModalVisible(true);
		} catch (error) {
			console.log("SignIn data error:", error.message);
			setError(error.message || "Error de registro");
		}
	};

	const handleTic = () => {
		navigation.navigate("Tic");
	};

	const handleAcceptSwitch = () => {
		setAcceptTic(!acceptTic);
	};

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<TextInput
				placeholder="Correo electrónico"
				placeholderTextColor="#000000ff"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				placeholder="Contraseña"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TextInput
				placeholder="Confirma Contraseña"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={rePassword}
				onChangeText={setRePassword}
			/>
			<View style={styles.switchContainer}>
				<Switch
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					thumbColor={"#f4f3f4"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={handleAcceptSwitch}
					value={acceptTic}
				/>
				<View style={styles.ticContainer}>
					<Text>Acepto </Text>
					<TouchableOpacity onPress={() => handleTic()}>
						<Text>TÉRMINOS Y CONDICIONES</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity onPress={() => handleSignIn()}>
				<Text>Ingresar</Text>
			</TouchableOpacity>

			<CustomModal
				visible={isSuccessModalVisible}
				onClose={() => setIsSuccessModalVisible(false)}
				title="Bienvenido!"
				message="Por favor revisa tu email para verificar tu cuenta."
				backgroundColor="#e6ffe6"
				iconName="checkmark-circle-outline"
				iconColor="green"
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
						style: { backgroundColor: "green" },
					},
				]}
			/>
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
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
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
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
});
