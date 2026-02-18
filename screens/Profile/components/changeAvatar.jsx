import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { changeUserAvatar } from "../../../services/apiEndpoints.js";
import { useUser } from "../../../context/UserContext.js";
import * as ImagePicker from "expo-image-picker";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import { globalStyles } from "../../../stylesConstants.js";

export default function ChangeAvatar({ uid }) {
	const { setUserAvatar } = useUser();

	const [error, setError] = useState("");
	const [errorModalVisible, setErrorModalVisible] = useState(false);

	async function handleChangeAvatar() {
		setError("");
		try {
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (permissionResult.granted === false)
				return handleError("¡Permiso denegado para acceder a las fotos!");

			let pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true, // Opcional
				aspect: [4, 3], // Opcional
				quality: 1,
			});

			if (
				pickerResult.canceled ||
				!pickerResult.assets ||
				pickerResult.assets.length === 0
			)
				return;

			const selectedImage = pickerResult.assets[0];

			const formData = new FormData();
			formData.append("avatar", {
				name: selectedImage.fileName || selectedImage.uri.split("/").pop(),
				type: selectedImage.mimeType,
				uri: selectedImage.uri,
			});

			const responseData = await changeUserAvatar(uid, formData);
			console.log("changeAvatar data:", responseData);
			if (responseData) setUserAvatar(responseData);
		} catch (error) {
			console.log(error.response.data);
			setError(error.response?.data?.error.message || "Error al cambiar Avatar");
		}
	}

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarButton}>
				<Text style={styles.avatarButtonText}>Cambiar Avatar</Text>
			</TouchableOpacity>
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
		marginTop: 10,
	},
	avatarButton: {
		borderRadius: 18,
		backgroundColor: globalStyles.colors.secondary,
		marginTop: 10,
	},

	avatarButtonText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: "white",
		textAlign: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
});
