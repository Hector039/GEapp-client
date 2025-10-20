import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
	initialize,
	requestPermission,
	readRecords,
} from "react-native-health-connect";
import { useUser } from "../context/UserContext.js";
import {
	getUserTotalSteps,
	saveUserSession,
	updateUserTotalSteps,
} from "../services/apiEndpoints.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserIndicatorsSection() {
	const { user, steps } = useUser();

	const [error, setError] = useState("");

	const [pastStepCount, setPastStepCount] = useState(0);
	const [totalSteps, setTotalSteps] = useState(0);

	const getDailySteps = async (uid) => {
		try {
			// Initialize the pedometer
			const isInitialized = await initialize();
			console.log("is pedometer avaliable?:", isInitialized);

			if (!isInitialized) {
				console.log("El sensor de pasos no está disponible");
				setError("El sensor de pasos no está disponible en este dispositivo.");
				return;
			}

			const grantedPermissions = await requestPermission([
				{ accessType: "read", recordType: "Steps" },
			]);

			console.log("permisos concedidos:", grantedPermissions);

			if (
				!grantedPermissions.some((permission) => permission.recordType === "Steps")
			) {
				console.log("Required permissions were not granted");
				setError("Sin permisos concedidos por el usuario.");
				return;
			}

			const stepPeriod = await AsyncStorage.getItem("stepPeriod");
			console.log("stepPeriod from LS:", stepPeriod);

			if (stepPeriod) {
				const parsedStepPeriod = JSON.parse(stepPeriod);

				const { records } = await readRecords("Steps", {
					timeRangeFilter: {
						operator: "between",
						startTime: parsedStepPeriod.start,
						endTime: parsedStepPeriod.end,
					},
				});
				console.log("records:", records);
			}
			/* if (isInitialized) {
				const grantedPermissions = await requestPermission([
					{ accessType: "read", recordType: "Steps" },
				]);

				if (!grantedPermissions.includes("Steps")) {
					console.log("Required permissions were not granted");
					setError("Sin permisos concedidos por el usuario.");
					return;
				}
				const stepCount = await AsyncStorage.getItem("stepCount");
				if (stepCount) {
					const parsedStepCount = JSON.parse(stepCount);
					const { records } = await readRecords("step_count", {
						timeRangeFilter: {
							operator: "between",
							startTime: parsedStepCount.start,
							endTime: parsedStepCount.end,
						},
					});
					console.log("records:", records);

					//setPastStepCount(records);

					if (records > 0) {
						try {
							const responseData = await saveUserSession(
								uid,
								records,
								parsedStepCount.start
							);
							console.log("User session saved:", responseData);
						} catch (error) {
							console.log("Error saving user session:", error);
						}

						try {
							if (records > 0) {
								await AsyncStorage.removeItem("stepCount");
								const updateResponse = await updateUserTotalSteps(uid, records);
								console.log("User total steps updated:", updateResponse);
							}
						} catch (error) {
							console.log("Error updating user total steps:", error);
						} 
					}
				} else {
					setError("Sensor de pasos no disponible.");
				}
			}*/
		} catch (error) {
			console.error(error);
		}
	};

	async function fetchUserTotalSteps(uid) {
		try {
			const responseData = await getUserTotalSteps(uid);
			if (responseData.totalSteps) setTotalSteps(responseData.totalSteps || 0);
		} catch (error) {
			console.error(error);
			setError("Error al cargar los pasos totales del usuario");
		}
	}

	useEffect(() => {
		if (user) {
			fetchUserTotalSteps(user.id);
			getDailySteps(user.id);
		}
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	<Text>Sensor de pasos disponible!</Text>}
			<View style={styles.indicatorsContainer}>
				<View style={styles.stepsContainer}>
					<Text>Pasos totales:</Text>
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
