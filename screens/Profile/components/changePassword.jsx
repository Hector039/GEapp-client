import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useState } from "react";
import { changePass } from "../../../services/apiEndpoints.js";
import { passwordRegex } from "../../../tools/regexConstants.js";
import CustomModal from "../../../tools/CustomModal.jsx";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import { globalStyles } from "../../../stylesConstants.js";

export default function ChangePassword({ uid }) {
	const [error, setError] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const [errorModalVisible, setErrorModalVisible] = useState(false);
	const [warningModalVisible, setWarningModalVisible] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRePassword, setNewRePassword] = useState("");

	async function handleChangePassword() {
		setError("");

		if (!oldPassword || !newPassword || !newRePassword)
			return handleError("Faltan datos");
		if (newPassword !== newRePassword)
			return handleError("Las contraseñas no coinciden");

		if (!passwordRegex.test(oldPassword))
			return handleError(
				"Contraseña anterior inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales",
			);
		if (!passwordRegex.test(newPassword))
			return handleError(
				"Contraseña nueva inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales",
			);
		try {
			const responseData = await changePass(uid, oldPassword, newPassword);
			console.log("changePass data:", responseData);
			if (responseData) setModalVisible(true);
		} catch (error) {
			console.log(error.response.data);
			handleError(
				error.response?.data?.error.message || "Error al cambiar contraseña",
			);
		}
	}

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Password</Text>
			<TextInput
				placeholder="Contraseña anterior"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={oldPassword}
				onChangeText={setOldPassword}
				style={styles.textInput}
			/>

			<TextInput
				placeholder="Contraseña nueva"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={newPassword}
				onChangeText={setNewPassword}
				style={styles.textInput}
			/>
			<TextInput
				placeholder="Confirma nueva contraseña"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={newRePassword}
				onChangeText={setNewRePassword}
				style={styles.textInput}
			/>

			<TouchableOpacity
				onPress={() => setWarningModalVisible(true)}
				style={styles.changePassButton}
			>
				<Text style={styles.textButton}>Cambiar Password</Text>
			</TouchableOpacity>

			<CustomModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				title="Correcto!"
				message="Recuerda usar tu nueva contraseña en tu próximo logueo."
				backgroundColor="#e6ffe6"
				iconName="checkmark-circle-outline"
				iconColor={globalStyles.colors.primary}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setModalVisible(false);
						},
						style: { backgroundColor: globalStyles.colors.primary },
					},
				]}
			/>
			<CustomModal
				visible={warningModalVisible}
				onClose={() => setWarningModalVisible(false)}
				title="Atención!"
				message="Estás seguro? Vas a cambiar tu contraseña."
				backgroundColor="#e6ffe6"
				iconName="warning-outline"
				iconColor={globalStyles.colors.primary}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setWarningModalVisible(false);
							handleChangePassword();
						},
						style: { backgroundColor: globalStyles.colors.primary },
					},
				]}
			/>
			<CustomLightModal
				visible={errorModalVisible}
				onClose={() => setErrorModalVisible(!errorModalVisible)}
				errorMessage={error}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginBlock: 30,
	},
	title: {
		fontFamily: "RubikMedium",
		fontSize: 20,
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
		marginTop: 10,
		paddingBlock: 12,
	},
	changePassButton: {
		borderRadius: 18,
		backgroundColor: globalStyles.colors.secondary,
		marginTop: 10,
	},
	textButton: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: "white",
		textAlign: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
});
