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

	let start = new Date();

	const handleStart = async () => {
		try {
			const isInitialized = await initialize();
			if (!isInitialized) {
				console.log("El sensor de pasos no está disponible");
				return;
			}
			if (subscriptionState === false) {
				await AsyncStorage.removeItem("stepPeriod");
				start = new Date();
				const end = new Date();
				end.setHours(end.getHours() + user.HOURS_TO_COUNT_STEPS || 2); // 2 horas al futuro por defecto
				const stepCount = {
					start: start.toISOString(),
					end: end.toISOString(),
				};
				await AsyncStorage.setItem("stepPeriod", JSON.stringify(stepCount));
				setSubcriptionState(true);
			} else {
				setSubcriptionState(false);
				const end = new Date() - start;
				const stepCount = {
					start: start.toISOString(),
					end: end.toISOString(),
				};
				await AsyncStorage.setItem("stepPeriod", JSON.stringify(stepCount));
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
