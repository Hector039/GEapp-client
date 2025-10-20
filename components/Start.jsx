import { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialize } from "react-native-health-connect";

export default function Start() {
	const [subscriptionState, setSubcriptionState] = useState(false);

	const handleStart = async () => {
		try {
			const isInitialized = await initialize();
			if (!isInitialized) {
				console.log("El sensor de pasos no está disponible desde Start.jsx");
				return;
			}
			if (subscriptionState === false) {
				const start = new Date().toISOString();
				await AsyncStorage.setItem("startCountingSteps", JSON.stringify(start));
				setSubcriptionState(true);
			} else {
				const end = new Date().toISOString();
				await AsyncStorage.setItem("endCountingSteps", JSON.stringify(end));
				setSubcriptionState(false);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<TouchableOpacity style={styles.startItem} onPress={handleStart}>
			<Text style={styles.startText}>
				{subscriptionState ? "Detener" : "Iniciar"}
			</Text>
		</TouchableOpacity>
	);
}

export const styles = StyleSheet.create({
	startItem: {
		alignItems: "center",
	},
	startText: {
		color: "white",
		fontSize: 12,
	},
});
