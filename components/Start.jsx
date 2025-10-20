import { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext.js";
import {
	initialize,
	requestPermission,
	readRecords,
} from "react-native-health-connect";

export default function Start() {
	const { user, setSteps } = useUser();

	const [subscriptionState, setSubcriptionState] = useState(false);

	let unsubscribe;

	const handleSubscribe = async () => {
		const start = Date.now();

		try {
			if (subscriptionState === false) {
				const stepCount = {
					start,
					end: Date.now() + (user.HOURS_TO_COUNT_STEPS || 2) * 60 * 60 * 1000, // 2 horas al futuro por defecto
				};
				await AsyncStorage.setItem("stepCount", JSON.stringify(stepCount));

				// Initialize the pedometer
				const isInitialized = await initialize();
				console.log("is pedometer avaliable?:", isInitialized);
			} else {
				setSubcriptionState(false);
				const end = Date.now() - start;
				const stepCount = {
					start,
					end,
				};
				await AsyncStorage.setItem("stepCount", JSON.stringify(stepCount));
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<TouchableOpacity style={styles.startItem} onPress={handleSubscribe}>
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
