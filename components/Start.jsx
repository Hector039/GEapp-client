import { useState, useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { StepsContext } from "../context/StepsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext.js";

export default function Start() {
	const { setSteps } = useContext(StepsContext);
	const { user } = useUser();

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
				const isInitialized = await AndroidPedometer.initialize();

				if (isInitialized) {
					// Setup background updates with custom notification
					await AndroidPedometer.setupBackgroundUpdates({
						title: "Step Counter",
						contentTemplate: "You've taken %d steps today",
						style: "bigText",
						iconResourceName: "ic_notification",
					});
					// Subscribe to real-time step updates
					unsubscribe = AndroidPedometer.subscribeToChange((event) => {
						console.log(`Steps: ${event.steps} at timestamp: ${event.timestamp}`);
						setSteps(event.steps);
					});
					setSubcriptionState(true);
				}
			} else {
				setSubcriptionState(false);
				unsubscribe && unsubscribe();
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

	useEffect(() => {
		return () => {
			setSubcriptionState(false);
			unsubscribe && unsubscribe();
		};
	}, []);

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
