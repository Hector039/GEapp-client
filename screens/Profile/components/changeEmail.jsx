import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useState } from "react";
import { changeUserEmail } from "../../../services/apiEndpoints.js";
import { emailRegex } from "../../../tools/regexConstants.js";
import CustomModal from "../../../tools/CustomModal.jsx";
import { useUser } from "../../../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import { globalStyles } from "../../../stylesConstants.js";

export default function ChangeEmail({ uid, oldEmail }) {
	const navigation = useNavigation();
	const { logout } = useUser;

	const [errorModalVisible, setErrorModalVisible] = useState(false);
	const [warningModalVisible, setWarningModalVisible] = useState(false);
	const [error, setError] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const [newEmail, setNewEmail] = useState(oldEmail);

	async function handleChangeEmail() {
		setError("");

		if (!newEmail) return handleError("Faltan datos");
		if (!emailRegex.test(newEmail))
			return handleError("Correo inválido, verifica e intenta nuevamente");
		if (newEmail === oldEmail)
			return handleError("El nuevo correo debe ser diferente al anterior");
		try {
			const responseData = await changeUserEmail(uid, newEmail);
			console.log("changeEmail data:", responseData);
			if (responseData.ok) setModalVisible(true);
		} catch (error) {
			console.log(error.response.data.error);
			handleError(
				error.response.data.error.message || "Error al cambiar el email",
			);
		}
	}

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Email</Text>
			<TextInput
				placeholder="Correo electrónico"
				placeholderTextColor="#5E5D5D"
				value={newEmail}
				onChangeText={setNewEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				style={styles.textInput}
			/>

			<TouchableOpacity
				onPress={() => setWarningModalVisible(true)}
				style={styles.changeEmailButton}
			>
				<Text style={styles.textButton}>Cambiar Email</Text>
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
			<CustomModal
				visible={warningModalVisible}
				onClose={() => setWarningModalVisible(false)}
				title="Atención!"
				message="Estás seguro? deberás verificar tu nuevo email nuevamente."
				backgroundColor="#e6ffe6"
				iconName="warning-outline"
				iconColor="green"
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setWarningModalVisible(false);
							handleChangeEmail();
						},
						style: { backgroundColor: "green" },
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
		marginTop: 30,
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
	changeEmailButton: {
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
