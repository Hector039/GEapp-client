import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useState } from "react";
import axios from "../../services/axiosInstance";
import { emailRegex } from "../../tools/regexConstants";
import CustomModal from "../../tools/CustomModal";
import { useUser } from "../../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";

const changeEmail = "users/changeemail";

export default function ChangeEmail({ uid, oldEmail }) {
	const navigation = useNavigation();
	const { logout } = useUser;

	const [error, setError] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const [newEmail, setNewEmail] = useState(oldEmail);

	function handleChangeEmail() {
		setError("");
		try {
			if (!newEmail) return setError("Faltan datos");
			if (!emailRegex.test(newEmail))
				return setError("Correo inválido, verifica e intenta nuevamente");
			if (newEmail === oldEmail)
				return setError("El nuevo correo debe ser diferente al anterior");
			axios
				.put(changeEmail, { uid, newEmail })
				.then((response) => {
					setModalVisible(true);
				})
				.catch((error) => {
					console.log(error.response.data.error);
					setError(
						error.response.data.error.message || "Error al cambiar contraseña"
					);
				});
		} catch (error) {
			console.log("email change error:", error);
		}
	}

	return (
		<>
			{error ?
				<Text>{error}</Text>
			:	null}
			<View style={styles.container}>
				<TextInput
					placeholder="Correo electrónico"
					placeholderTextColor="#000000ff"
					value={newEmail}
					onChangeText={setNewEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>

				<TouchableOpacity onPress={handleChangeEmail}>
					<Text>Cambiar Email</Text>
				</TouchableOpacity>

				<CustomModal
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					title="Correcto!"
					message="Recuerda revisar tu correo para activar tu nuevo E-mail."
					backgroundColor="#e6ffe6"
					iconName="checkmark-circle-outline"
					iconColor="green"
					buttons={[
						{
							text: "Aceptar",
							onPress: () => {
								setModalVisible(false);
								logout();
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
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		backgroundColor: "#aeaeaeff",
		width: "90%",
	},
});
