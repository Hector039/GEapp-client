import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../../stylesConstants.js";
import { useUser } from "../../../context/UserContext.js";
import { deactivateAccount } from "../../../services/apiEndpoints.js";
import CustomModal from "../../../tools/CustomModal.jsx";
import { useState } from "react";

export default function DeactivateAccountButton({ uid }) {
	const { logout } = useUser();
	const navigation = useNavigation();
	const [warningModalVisible, setWarningModalVisible] = useState(false);

	function handleDeactivate() {
		setWarningModalVisible(true);
	}

	async function handleDeactivateAccount() {
		try {
			const responseData = await deactivateAccount(uid);
			if (responseData.ok) {
				logout();
				navigation.reset({
					index: 0,
					routes: [{ name: "SignLogin" }],
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<TouchableOpacity style={styles.ticButton} onPress={handleDeactivate}>
			<Text style={styles.ticButtonText}>Desactivar cuenta</Text>
			<CustomModal
				visible={warningModalVisible}
				onClose={() => setWarningModalVisible(false)}
				title="Atención!"
				message="Estás seguro? Vas a desactivar tu cuenta."
				backgroundColor="#e6ffe6"
				iconName="warning-outline"
				iconColor="#736f38ff"
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setWarningModalVisible(false);
							handleDeactivateAccount();
						},
						style: { backgroundColor: "green" },
					},
					{
						text: "Cancelar",
						onPress: () => {
							setWarningModalVisible(false);
						},
						style: { backgroundColor: "#735F38" },
					},
				]}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	ticButton: {
		alignSelf: "center",
		marginBottom: 30,
		borderTopWidth: 2,
		borderBottomWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
		borderBottomColor: globalStyles.colors.secondary,
		width: "85%",
	},
	ticButtonText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: globalStyles.colors.tertiary,
		paddingVertical: 10,
		paddingLeft: 20,
	},
});
