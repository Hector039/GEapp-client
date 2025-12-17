import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
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
import { globalStyles } from "../../../stylesConstants.js";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import CircularProgress from "./CircularProgress.jsx";
import { useNavigation } from "@react-navigation/native";

export default function UserIndicatorsSection({
	uid,
	hoursToCountSteps,
	recommendedSteps,
	eid,
	setSteps,
	steps,
}) {
	const navigation = useNavigation();
	const [error, setError] = useState(false);
	const [errorModalVisible, setErrorModalVisible] = useState(false);

	const getDailySteps = async (userId) => {
		try {
			// Check SDK availability
			const status = await getSdkStatus();
			if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE)
				handleError("SDK no disponible.");
			if (
				status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
			)
				handleError("SDK no disponible, se requiere actualización");

			// Initialize the pedometer
			const isInitialized = await initialize();

			if (!isInitialized) {
				handleError("El sensor de pasos no disponible en este dispositivo.");
				return;
			}

			const grantedPermissions = await requestPermission([
				{ accessType: "read", recordType: "Steps" },
			]);

			if (
				!grantedPermissions.some((permission) => permission.recordType === "Steps")
			) {
				handleError("Sin permisos concedidos por el usuario.");
				return;
			}

			const startCountingSteps = await AsyncStorage.getItem("startCountingSteps");

			if (!startCountingSteps) return;

			const parsedStartCountingSteps = new Date(JSON.parse(startCountingSteps));

			let endCountingSteps = await AsyncStorage.getItem("endCountingSteps");
			endCountingSteps =
				endCountingSteps ?
					new Date(JSON.parse(endCountingSteps)).toISOString()
				:	null;

			if (endCountingSteps === null) {
				const endCountingStepsTwoHours =
					parsedStartCountingSteps.getTime() +
					(hoursToCountSteps || 2) * 60 * 60 * 1000;
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

			const dateToPass = new Date(year, month - 1, day).toISOString();

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

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	function handleGoToChallenge() {
		navigation.navigate("Challenges");
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tu actividad</Text>
			<View style={styles.indicatorsCardContainer}>
				<CircularProgress percentage={(steps * 100) / recommendedSteps} />

				<ImageBackground
					style={styles.challengeContainer}
					source={require("../assets/mountain.png")}
					resizeMode="contain"
				>
					<TouchableOpacity
						onPress={handleGoToChallenge}
						style={styles.challengeButton}
					>
						<Text style={styles.challengeText}>Desafíos</Text>
						<Text style={styles.challengeSeeText}>Ver</Text>
					</TouchableOpacity>
				</ImageBackground>
			</View>
			<Text style={styles.subTitle}>
				¡Has alcanzado el {(steps * 100) / recommendedSteps}% de tu objetivo de hoy,
				mantente enfocado en tu salud!
			</Text>
			<CustomLightModal
				visible={errorModalVisible}
				onClose={() => setErrorModalVisible(!errorModalVisible)}
				errorMessage={error}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 15,
		borderRadius: 20,
		borderColor: "#D0DBE2",
		borderWidth: 1,
		width: "88%",
		alignSelf: "center",
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: 20,
		color: globalStyles.colors.tertiary,
		paddingVertical: 15,
		paddingLeft: 15,
	},
	subTitle: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
		color: globalStyles.colors.tertiary,
		paddingHorizontal: 30,
		marginVertical: 20,
		textAlign: "center",
	},
	indicatorsCardContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
	},
	percentage: {
		fontFamily: "RubikBold",
		fontSize: 35,
		color: globalStyles.colors.primary,
	},
	percentageText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
	},
	challengeContainer: {
		borderRadius: 10,
		width: 160,
		height: 180,
		justifyContent: "center",
	},
	challengeSeeText: {
		fontFamily: "RubikBold",
		fontSize: 22,
		color: "#043000",
	},
	challengeText: {
		fontFamily: "RubikMedium",
		fontSize: 16,
		color: "#043000",
		paddingRight: 30,
	},
	challengeButton: {
		paddingLeft: 10,
		gap: 25,
	},
});
