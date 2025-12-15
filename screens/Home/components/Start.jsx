import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../../stylesConstants";
import { useUser } from "../../../context/UserContext.js";

export default function Start() {
	const { subscriptionState, setSubcriptionState } = useUser();

	const handleStart = async () => {
		try {
			if (subscriptionState === false) {
				let start = new Date();
				await AsyncStorage.setItem("startCountingSteps", JSON.stringify(start));
				setSubcriptionState(true);
			} else {
				let end = new Date();
				await AsyncStorage.setItem("endCountingSteps", JSON.stringify(end));
				setSubcriptionState(false);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<TouchableOpacity onPress={handleStart} style={styles.startButton}>
			<Text style={styles.startText}>
				{subscriptionState ? "Detener" : "Iniciar"}
			</Text>
			{subscriptionState ?
				<Image style={styles.stopIcon} source={require("../assets/Stop.png")} />
			:	<Image source={require("../assets/Play.png")} />}
		</TouchableOpacity>
	);
}

export const styles = StyleSheet.create({
	startButton: {
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
		width: 111,
		height: 50,
		paddingBlock: 10,
		borderRadius: 30,
		elevation: 3,
	},
	startText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
	},
	stopIcon: {
		width: 23,
		height: 23,
	},
});
