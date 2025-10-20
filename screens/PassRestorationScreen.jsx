import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { restorePassword } from "../services/apiEndpoints.js";
import { passwordRegex, emailRegex } from "../tools/regexConstants";
import CustomModal from "../tools/CustomModal";

export default function PassRestorationScreen() {
	const navigation = useNavigation();
	const [error, setError] = useState("");

	const [modalVisible, setModalVisible] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");

	const handleRestorePassword = async () => {
		setError("");
		try {
			if (!email || !password || !rePassword) return setError("Faltan datos");
			if (password !== rePassword) return setError("Las contraseñas no coinciden");

			if (!emailRegex.test(email))
				return setError("Correo inválido, verifica e intenta nuevamente");
			if (!passwordRegex.test(password))
				return setError(
					"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
				);

			try {
				const responseData = await restorePassword(email, password);
				if (responseData) setModalVisible(true);
			} catch (error) {
				setError("Error al enviar datos de restauración");
			}
		} catch (error) {
			console.log("Login error:", error);
		}
	};

	function handleBackToLogin() {
		navigation.reset({ index: 0, routes: [{ name: "SignLogin" }] });
	}

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<TextInput
				placeholder="Correo electrónico registrado"
				placeholderTextColor="#000000ff"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				placeholder="Contraseña nueva"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TextInput
				placeholder="Confirma Contraseña nueva"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={rePassword}
				onChangeText={setRePassword}
			/>
			<TouchableOpacity onPress={() => handleRestorePassword()}>
				<Text>Enviar</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => handleBackToLogin()}>
				<Text>Volver</Text>
			</TouchableOpacity>

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
});
