import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useState } from "react";
import axios from "../../services/axiosInstance";
import { passwordRegex } from "../../tools/regexConstants";
import CustomModal from "../../tools/CustomModal";

const changePass = "users/changepassword";

export default function ChangePassword({ uid }) {
	const [error, setError] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRePassword, setNewRePassword] = useState("");

	function handleChangePassword() {
		setError("");
		try {
			if (!oldPassword || !newPassword || !newRePassword)
				return setError("Faltan datos");
			if (newPassword !== newRePassword)
				return setError("Las contraseñas no coinciden");

			if (!passwordRegex.test(oldPassword))
				return setError(
					"Contraseña anterior inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
				);
			if (!passwordRegex.test(newPassword))
				return setError(
					"Contraseña nueva inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
				);

			axios
				.put(changePass, { uid, oldPassword, newPassword })
				.then((response) => {
					setModalVisible(true);
				})
				.catch((error) => {
					console.log(error.response.data);
					setError(
						error.response?.data?.error.message || "Error al cambiar contraseña"
					);
				});
		} catch (error) {
			console.log("pass change error:", error);
		}
	}

	return (
		<>
			{error ?
				<Text>{error}</Text>
			:	null}
			<View style={styles.container}>
				<TextInput
					placeholder="Contraseña anterior"
					placeholderTextColor="#000000ff"
					secureTextEntry
					value={oldPassword}
					onChangeText={setOldPassword}
				/>

				<TextInput
					placeholder="Contraseña nueva"
					placeholderTextColor="#000000ff"
					secureTextEntry
					value={newPassword}
					onChangeText={setNewPassword}
				/>
				<TextInput
					placeholder="Confirma nueva contraseña"
					placeholderTextColor="#000000ff"
					secureTextEntry
					value={newRePassword}
					onChangeText={setNewRePassword}
				/>

				<TouchableOpacity onPress={handleChangePassword}>
					<Text>Cambiar Password</Text>
				</TouchableOpacity>

				<CustomModal
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					title="Correcto!"
					message="Recuerda usar tu nueva contraseña en tu próximo logueo."
					backgroundColor="#e6ffe6"
					iconName="checkmark-circle-outline"
					iconColor="green"
					buttons={[
						{
							text: "Aceptar",
							onPress: () => {
								setModalVisible(false);
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
		marginTop: 10,
		paddingBlock: 10,
		alignItems: "center",
		backgroundColor: "#aeaeaeff",
		width: "90%",
	},
});
