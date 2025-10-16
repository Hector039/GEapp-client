import { useState, useRef, useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";
import { useNavigation } from "@react-navigation/native";
import { StepsContext } from "../context/StepsContext";

export default function Start() {
	const navigation = useNavigation();
	const { setSteps } = useContext(StepsContext);
	const [subscriptionState, setSubcriptionState] = useState(false);
	const pedometerSubscription = useRef(null);

	const handleSubscribe = async () => {
		try {
			const isAvailable = await Pedometer.isAvailableAsync();
			if (isAvailable) {
				const permission = await Pedometer.getPermissionsAsync();
				if (!permission.granted) {
					const request = await Pedometer.requestPermissionsAsync();
					if (!request.granted) return;
					navigation.reset({ index: 0, routes: [{ name: "Home" }] });
				}
				if (!subscriptionState) {
					pedometerSubscription.current = Pedometer.watchStepCount((result) => {
						setSteps(result.steps);
					});
					setSubcriptionState(true);
				} else {
					if (pedometerSubscription.current) {
						pedometerSubscription.current.remove();
						pedometerSubscription.current = null;
					}
					setSubcriptionState(false);
				}
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
