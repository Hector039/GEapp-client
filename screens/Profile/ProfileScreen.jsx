import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useUser } from "../../context/UserContext.js";
import Logout from "./components/logout.jsx";
import ChangePassword from "./components/changePassword.jsx";
import ChangeEmail from "./components/changeEmail.jsx";
//import ChangeAvatar from "./components/changeAvatar.jsx";
import { globalStyles } from "../../stylesConstants.js";
import TicButton from "./components/ticButton.jsx";
import DeactivateAccountButton from "./components/deactivateAccountButton.jsx";

import * as ImagePicker from "expo-image-picker";
import CustomLightModal from "../../tools/CustomLightModal.jsx";
import { changeUserAvatar } from "../../services/apiEndpoints.js";
import { useState } from "react";

export default function ProfileScreen() {
	const { user, userAvatar, setUserAvatar } = useUser();
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

			const responseData = await changeUserAvatar(user.id, formData);
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
			<Text style={styles.title}>Perfil</Text>
			{user ?
				<View style={styles.userInfocontainer}>
					<TouchableOpacity onPress={handleChangeAvatar}>
						<Image
							style={styles.userAvatar}
							source={
								userAvatar ?
									{ uri: userAvatar }
								:	require("../../assets/avatar-generico-dama.png")
							}
							resizeMode="cover"
						/>
					</TouchableOpacity>

					<View>
						<Text style={styles.emailTitleText}>Mail de registro</Text>
						<Text style={styles.emailText}>{user.email}</Text>
					</View>
				</View>
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView style={styles.scrollContent}>
					{/* <ChangeAvatar uid={user.id} /> */}
					<ChangeEmail uid={user.id} oldEmail={user.email} />
					<ChangePassword uid={user.id} />
					<View style={styles.separator}>
						<Logout />
					</View>
					<View style={styles.separator}>
						<TicButton />
					</View>
					<View style={styles.separator}>
						<DeactivateAccountButton uid={user.id} />
					</View>
					<View style={styles.lastSeparator}></View>
				</ScrollView>
			:	<ActivityIndicator size="large" />}

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
		flex: 1,
		gap: 20,
	},
	scrollContent: {
		flexGrow: 1,
	},
	title: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		textAlign: "center",
		marginTop: 20,
	},
	userInfocontainer: {
		flexDirection: "row",
		alignSelf: "center",
		alignItems: "center",
		gap: 20,
	},
	userAvatar: {
		width: 130,
		height: 130,
		borderRadius: 80,
	},
	emailTitleText: {
		fontFamily: "RubikMedium",
		fontSize: 20,
	},
	emailText: {
		fontFamily: "RubikMedium",
		fontSize: 14,
	},
	separator: {
		alignSelf: "center",
		borderTopWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
		width: "85%",
	},
	lastSeparator: {
		alignSelf: "center",
		borderTopWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
		width: "85%",
		marginBottom: 2,
	},
});
