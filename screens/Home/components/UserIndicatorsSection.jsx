import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
	initialize,
	requestPermission,
	readRecords,
	getSdkStatus,
	SdkAvailabilityStatus,
} from "react-native-health-connect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	saveUserSession,
	updateUserTotalSteps,
	updateOrgEventSteps,
} from "../../../services/apiEndpoints.js";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function UserIndicatorsSection({
	uid,
	recommendedSteps,
	eid,
	setSteps,
	steps,
}) {
	const [error, setError] = useState("");

	const getDailySteps = async (userId) => {
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

			const year = parsedStartCountingSteps.getFullYear();
			const month = String(parsedStartCountingSteps.getMonth() + 1).padStart(
				2,
				"0"
			);
			const day = String(parsedStartCountingSteps.getDate()).padStart(2, "0");

			const dateToPass = `${year}-${month}-${day}`;

			const { records } = await readRecords("Steps", {
				timeRangeFilter: {
					operator: "between",
					startTime: dateToPass,
					endTime: endCountingSteps,
				},
			});

			await AsyncStorage.removeItem("startCountingSteps");
			await AsyncStorage.removeItem("endCountingSteps");

			console.log("records:", records);

			if (records.length > 0 && records[0].count > 0) {
				try {
					const responseData = await saveUserSession(
						userId,
						records[0].count,
						parsedStartCountingSteps.toLocaleDateString("en-CA")
					);
					console.log("User session saved:", responseData);
					//setPastStepCount(responseData.steps || 0);
				} catch (error) {
					console.log("Error saving user session:", error);
				}

				try {
					const updateResponse = await updateUserTotalSteps(
						userId,
						records[0].count
					);
					console.log("User total steps updated:", updateResponse);
					setSteps(updateResponse.newTotalSteps);
				} catch (error) {
					console.log("Error updating user total steps:", error);
				}

				try {
					await updateOrgEventSteps(eid, records[0].count);
				} catch (error) {
					console.log("Error updating Org Event total steps:", error);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (uid) getDailySteps(uid);
	}, []);

	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
	};

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	<Text>Sensor de pasos disponible!</Text>}
			<Text>Meta diaria</Text>
			<View style={styles.indicatorsContainer}>
				<View style={styles.percentageContainer}>
					<Text>{(steps * 100) / recommendedSteps}%</Text>
				</View>
				<ProgressChart
					data={{ data: [steps / recommendedSteps] }}
					width={screenWidth}
					height={100}
					strokeWidth={20}
					radius={32}
					chartConfig={chartConfig}
					hideLegend={true}
				/>
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
		marginVertical: 15,
	},
	percentageContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	indicatorsContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		width: screenWidth,
		height: 120,
	},
});
