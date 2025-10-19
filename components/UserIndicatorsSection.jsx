import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import * as AndroidPedometer from "expo-android-pedometer";
import { StepsContext } from "../context/StepsContext";
import { useUser } from "../context/UserContext.js";
import axios from "../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userTotalSteps = "users/getusertotalsteps";
const updateUserTotalSteps = "users/updateusertotalsteps";
const saveUserSession = "sessions/saveusersession";

export default function UserIndicatorsSection() {
	const { user } = useUser();
	const { steps } = useContext(StepsContext);

	const [error, setError] = useState("");

	const [pastStepCount, setPastStepCount] = useState(0);
	const [totalSteps, setTotalSteps] = useState(0);

	const getDailySteps = async (uid) => {
		try {
			// Initialize the pedometer
			const isInitialized = await AndroidPedometer.initialize();

			if (isInitialized) {
				// Check current permission status
				const hasActivityPermission =
					AndroidPedometer.getActivityPermissionStatus();
				const hasNotificationPermission =
					AndroidPedometer.getNotificationPermissionStatus();

				if (!hasActivityPermission || !hasNotificationPermission) {
					// Request necessary permissions
					const permissionResponse = await AndroidPedometer.requestPermissions();
					const notificationPermissionResponse =
						await AndroidPedometer.requestNotificationPermissions();

					if (
						!permissionResponse.granted ||
						!notificationPermissionResponse.granted
					) {
						console.log("Required permissions were not granted");
						setError("Sin permisos concedidos por el usuario.");
						return;
					}
					// Get today's steps
					const todaySteps = await AndroidPedometer.getStepsCountAsync();
					console.log(`Today's steps: ${todaySteps}`);
					setPastStepCount(todaySteps);

					//Get steps in a period
					const stepCount = await AsyncStorage.getItem("stepCount");
					if (stepCount) {
						const parsedStepCount = JSON.parse(stepCount);
						const periodSteps = await AndroidPedometer.getStepsCountInRangeAsync(
							parsedStepCount.start,
							parsedStepCount.end
						);
						console.log("Step counts by period:", periodSteps);
						if (periodSteps > 0) {
							axios
								.post(saveUserSession, {
									uid,
									steps: periodSteps,
									date: parsedStepCount.start,
								})
								.then(async (response) => {
									console.log("User session saved:", response.data);
									await AsyncStorage.removeItem("stepCount");
									axios
										.put(updateUserTotalSteps, { uid, steps: periodSteps })
										.then((response) => {
											console.log("User total steps updated:", response.data);
										})
										.catch((error) => {
											console.log("Error updating user total steps:", error);
										});
								})
								.catch((error) => {
									console.log("Error saving user session:", error);
								});
						}
					}
				} else {
					setError("Sensor de pasos no disponible.");
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	function getUserTotalSteps(uid) {
		try {
			axios
				.get(userTotalSteps + `/${uid}`)
				.then((response) => {
					setTotalSteps(response.data);
				})
				.catch((error) => {
					console.log(error);
					setError("Error al cargar los pasos totales del usuario");
				});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (user) {
			getUserTotalSteps(user.id);
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
