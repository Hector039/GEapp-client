import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../../stylesConstants.js";

export default function TicButton() {
	const navigation = useNavigation();

	const handleGoToTic = () =>
		navigation.navigate("Tic", { comingFrom: "profile" });

	return (
		<TouchableOpacity style={styles.ticButton} onPress={handleGoToTic}>
			<Text style={styles.ticButtonText}>Términos y condiciones</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	ticButton: {
		alignSelf: "center",
		borderTopWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
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
