import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
	initialize,
	requestPermission,
	readRecords,
	getSdkStatus,
	SdkAvailabilityStatus,
} from "react-native-health-connect";
import { useUser } from "../context/UserContext.js";
import {
	getUserTotalSteps,
	saveUserSession,
	updateUserTotalSteps,
} from "../services/apiEndpoints.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserIndicatorsSection() {
	const { user } = useUser();

	const [error, setError] = useState("");

	const [pastStepCount, setPastStepCount] = useState(0);
	const [totalSteps, setTotalSteps] = useState(0);

	const getDailySteps = async (uid) => {
		try {
			// Check SDK availability
			const status = await getSdkStatus();
			if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE)
				setError("SDK is not available");
			if (
				status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
			)
				setError("SDK is not available, provider update required");

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

			//console.log("permisos concedidos:", grantedPermissions);

			if (
				!grantedPermissions.some((permission) => permission.recordType === "Steps")
			) {
				console.log("Required permissions were not granted");
				setError("Sin permisos concedidos por el usuario.");
				return;
			}

			const startCountingSteps = await AsyncStorage.getItem("startCountingSteps");

			if (!startCountingSteps) return;
			const parsedStartCountingSteps = JSON.parse(startCountingSteps);
			let endCountingSteps = await AsyncStorage.getItem("endCountingSteps");
			endCountingSteps = endCountingSteps ? JSON.parse(endCountingSteps) : null;

			if (!endCountingSteps) {
				const endCountingStepsTwoHours =
					new Date(parsedStartCountingSteps).getTime() +
					(user.HOURS_TO_COUNT_STEPS || 2) * 60 * 60 * 1000;
				endCountingSteps = new Date(endCountingStepsTwoHours).toISOString();
			}
			//console.log("startCountingSteps:", parsedStartCountingSteps);
			//console.log("endCountingSteps:", endCountingSteps);
			const { records } = await readRecords("Steps", {
				timeRangeFilter: {
					operator: "between",
					startTime: parsedStartCountingSteps,
					endTime: endCountingSteps,
				},
			});
			await AsyncStorage.removeItem("startCountingSteps");
			await AsyncStorage.removeItem("endCountingSteps");

			console.log("records:", records);

			if (records.length > 0 && records[0].count > 0) {
				try {
					const responseData = await saveUserSession(
						uid,
						records[0].count,
						startCountingSteps
					);
					console.log("User session saved:", responseData);
					setPastStepCount(responseData.steps || 0);
				} catch (error) {
					console.log("Error saving user session:", error);
				}

				try {
					const updateResponse = await updateUserTotalSteps(uid, records);
					console.log("User total steps updated:", updateResponse);
					setTotalSteps(updateResponse.newTotalSteps);
				} catch (error) {
					console.log("Error updating user total steps:", error);
				}
			}
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
					<Text>{totalSteps}</Text>
				</View>
				<View style={styles.stepsPercentageContainer}>
					<Text>Meta diaria:</Text>
					{user && user.RECOMMENDED_DAILY_STEPS && (
						<Text>{(pastStepCount * 100) / user.RECOMMENDED_DAILY_STEPS}%</Text>
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
