import { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Start() {
	const [subscriptionState, setSubcriptionState] = useState(false);

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
		<TouchableOpacity onPress={handleStart}>
			<Text style={styles.startText}>
				{subscriptionState ? "Detener" : "Iniciar"}
			</Text>
		</TouchableOpacity>
	);
}

export const styles = StyleSheet.create({
	startText: {
		fontSize: 12,
	},
});
