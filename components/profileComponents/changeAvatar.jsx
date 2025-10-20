import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { changeUserAvatar } from "../../services/apiEndpoints.js";
import { useUser } from "../../context/UserContext.js";
import * as ImagePicker from "expo-image-picker";

export default function ChangeAvatar({ uid }) {
	const { setUserAvatar } = useUser();

	const [error, setError] = useState("");

	async function handleChangeAvatar() {
		setError("");
		try {
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (permissionResult.granted === false)
				return setError("¡Permiso denegado para acceder a las fotos!");

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

	return (
		<>
			{error ?
				<Text>{error}</Text>
			:	null}
			<View style={styles.container}>
				<TouchableOpacity onPress={handleChangeAvatar}>
					<Text>Cambiar Avatar</Text>
				</TouchableOpacity>
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
