import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import { Pedometer } from "expo-sensors";
import { StepsContext } from "../context/StepsContext";
import { UserContext } from "../context/UserContext.js";

export default function UserIndicatorsSection() {
	const { user } = useContext(UserContext);
	const { steps } = useContext(StepsContext);
	const [error, setError] = useState("");
	const [pastStepCount, setPastStepCount] = useState(0);
	const [totalSteps, setTotalSteps] = useState(0);

	const getDailySteps = async () => {
		const isAvailable = await Pedometer.isAvailableAsync();
		console.log("Sensor de pasos disponible?:", isAvailable);

		if (isAvailable) {
			const end = new Date();
			const start = new Date();
			start.setDate(end.getDate() - 1);

			const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
			if (pastStepCountResult) {
				setPastStepCount(pastStepCountResult.steps);
			}
		} else {
			setError("Sensor de pasos no disponible.");
		}
	};

	useEffect(() => {
		if (user) {
			setTotalSteps(user.totalSteps);
			getDailySteps();
		}
	}, [user]);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	<Text>Sensor de pasos ok!</Text>}
			<View style={styles.indicatorsContainer}>
				<View style={styles.stepsContainer}>
					<Text>Pasos hasta ahora:</Text>
					<Text>{totalSteps + steps}</Text>
				</View>
				<View style={styles.stepsPercentageContainer}>
					<Text>Meta diaria:</Text>
					{user && user.RECOMMENDED_DAILY_STEPS && (
						<Text>
							{((pastStepCount + steps) * 100) / user.RECOMMENDED_DAILY_STEPS}%
						</Text>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
	stepsContainer: {
		alignItems: "center",
	},
	indicatorsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "80%",
		alignItems: "center",
	},
});
