import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../../stylesConstants.js";

export default function TicButton() {
	const navigation = useNavigation();

	const handleGoToTic = () =>
		navigation.navigate("Tic", { comingFrom: "profile" });

	return (
		<TouchableOpacity onPress={handleGoToTic}>
			<Text style={styles.ticButtonText}>Términos y condiciones</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	ticButtonText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: globalStyles.colors.tertiary,
		paddingVertical: 10,
		paddingLeft: 20,
	},
});
