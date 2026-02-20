import {
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../../stylesConstants";
import { useUser } from "../../../context/UserContext.js";
import { useEffect, useState } from "react";
import {
	saveUserSession,
	updateUserTotalSteps,
	updateOrgEventSteps,
} from "../../../services/apiEndpoints.js";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";

const LOCATION_TASK_NAME = "background-pedometer-task";

export default function Start() {
	const {
		subscriptionState,
		setSubcriptionState,
		setSteps,
		user,
		orgEvent,
		setSessionSteps,
		setOrgEventSteps,
		setProjectGoalSteps,
	} = useUser();
	const [pedometerSubscription, setPedometerSubscription] = useState(null);
	const [error, setError] = useState(false);
	const [errorModalVisible, setErrorModalVisible] = useState(false);

	const setTrackedSteps = async (steps) => {
		try {
			if (steps) {
				console.log("new tracked steps: ", steps);

				await AsyncStorage.setItem("tracked-steps", steps.toString());
			} else {
				await AsyncStorage.removeItem("tracked-steps");
			}
		} catch (error) {
			console.log("Error saveing tracked Steps");
		}
	};

	const getTrackedSteps = async () => {
		try {
			const trackedSteps = await AsyncStorage.getItem("tracked-steps");
			if (trackedSteps) {
				return parseInt(trackedSteps);
			} else {
				await AsyncStorage.removeItem("tracked-steps");
				return 0;
			}
		} catch (error) {
			console.log("Error getting tracked Steps");
		}
	};

	const loadSteps = async () => {
		try {
			const startCountingSteps = await AsyncStorage.getItem("start_time");

			if (!startCountingSteps) {
				setSubcriptionState(false);
				console.log("startCountingSteps = null");
				return;
			}
			setSubcriptionState(true);

			const parsedStartCountingSteps = new Date(JSON.parse(startCountingSteps));

			const nowDate = Date.now();

			let automatedEndTime = await AsyncStorage.getItem("automated_end_time");

			let endCountingSteps;

			if (automatedEndTime !== null && nowDate > JSON.parse(automatedEndTime)) {
				//Si el horario actual es mayor al horario del inicio más dos horas,
				// entonces se toma ese horario como final
				endCountingSteps = new Date(nowDate);
			} else {
				console.log("nowDate es menor a startCounting + 2 horas");
				return setSubcriptionState(true);
			}

			console.log("startCountingSteps:", parsedStartCountingSteps);
			console.log("endCountingSteps:", endCountingSteps);

			if (Platform.OS === "android") {
				setSubcriptionState(false);
				if (pedometerSubscription) pedometerSubscription.remove();
				setPedometerSubscription(null);

				// Detener el servicio de ubicación para liberar batería
				await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
			} else if (Platform.OS === "ios") {
				const pastStepCountResult = await Pedometer.getStepCountAsync(
					parsedStartCountingSteps,
					endCountingSteps,
				);
				if (pastStepCountResult) {
					console.log("pasos del intervalo para ios");
					setTrackedSteps(pastStepCountResult.steps);
				}
			}

			setSubcriptionState(false);
			await AsyncStorage.removeItem("automated_end_time");
			await AsyncStorage.removeItem("start_time");
			updateStepsToDataBase(user.id);
		} catch (error) {
			handleError(error.message || "Error al cargar la información de los pasos");
			console.error(error);
		}
	};

	useEffect(() => {
		loadSteps();
	}, []);

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
	};

	const handleStart = async () => {
		try {
			if (subscriptionState === false) {
				// 1. Pedir permisos
				const askPedometerPermision = await Pedometer.requestPermissionsAsync();

				if (askPedometerPermision.status !== "granted") {
					console.log("El usuario denegó el permiso del sensor de pasos.");
					handleError("El usuario denegó el permiso del sensor de pasos.");
					return;
				}

				if (Platform.OS === "android") {
					const askForegroundLocationPermision =
						await Location.requestForegroundPermissionsAsync();

					console.log(
						"Background task Permision: ",
						askForegroundLocationPermision.status,
					);
					if (askForegroundLocationPermision.status !== "granted") {
						console.log("El usuario denegó el permiso de foreground Location.");
						return;
					}
					const askBackgroundLocationPermision =
						await Location.requestBackgroundPermissionsAsync();

					console.log(
						"Background Location Permision: ",
						askBackgroundLocationPermision.status,
					);
					if (askBackgroundLocationPermision.status !== "granted") {
						console.log("El usuario denegó el permiso de background Location.");
						handleError(
							"El usuario denegó el permiso de ubicación en segundo plano.",
						);
						return;
					}

					const endTime = Date.now() + user.HOURS_TO_COUNT_STEPS * 60 * 60 * 1000;
					await AsyncStorage.setItem("automated_end_time", endTime.toString());

					const startTime = Date.now();
					await AsyncStorage.setItem("start_time", JSON.stringify(startTime));

					// 2. Iniciar el "escudo" de batería baja
					await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
						accuracy: Location.Accuracy.Lowest, // <--- CLAVE PARA LA BATERÍA
						timeInterval: 60000, // Solo intenta "despertar" cada 1 minuto
						distanceInterval: 100, // Solo si se mueve 100 metros
						foregroundService: {
							notificationTitle: "Modo Ahorro de Energía",
							notificationBody: "Contando pasos con consumo mínimo...",
							notificationColor: "#4CAF50",
						},
					});

					// 3. Iniciar el podómetro real
					const subscription = Pedometer.watchStepCount((result) => {
						setTrackedSteps(result.steps);
					});
					setPedometerSubscription(subscription);
				}
				setSubcriptionState(true);
			} else {
				if (Platform.OS === "android") {
					if (pedometerSubscription) pedometerSubscription.remove();
					setPedometerSubscription(null);

					// Detener el servicio de ubicación para liberar batería
					await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
				} else {
					const startTime = await AsyncStorage.getItem("start_time");
					const startTimeDate = new Date(JSON.parse(startTime));
					const endTime = new Date(Date.now());
					const pastStepCountResult = await Pedometer.getStepCountAsync(
						startTimeDate,
						endTime,
					);
					if (pastStepCountResult) {
						setTrackedSteps(pastStepCountResult.steps);
					}
				}

				await AsyncStorage.removeItem("start_time");
				await AsyncStorage.removeItem("automated_end_time");
				setSubcriptionState(false);
				updateStepsToDataBase(user.id);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const updateStepsToDataBase = async (userId) => {
		const stepsResult = await getTrackedSteps();
		const sessionDate = new Date().toLocaleDateString("en-CA");

		console.log("steps result:", stepsResult);

		if (stepsResult > 0) {
			try {
				const responseData = await saveUserSession(
					userId,
					stepsResult,
					sessionDate,
				);
				console.log("User session saved:", responseData);
				setSessionSteps(responseData.steps || 0);
			} catch (error) {
				console.log("Error saving user session:", error);
			}

			try {
				const updateResponse = await updateUserTotalSteps(userId, stepsResult);
				console.log("User total steps updated:", updateResponse);
				setSteps(updateResponse.newTotalSteps);
			} catch (error) {
				console.log("Error updating user total steps:", error);
			}

			try {
				const updateOrgResponse = await updateOrgEventSteps(
					orgEvent._id,
					stepsResult,
				);
				console.log("Orgevent steps updated:", updateOrgResponse);
				setOrgEventSteps(updateOrgResponse.orgEventSteps);
				setProjectGoalSteps(updateOrgResponse.projectGoalSteps);
			} catch (error) {
				console.log("Error updating Org Event total steps:", error);
			}
		}
		await AsyncStorage.removeItem("tracked-steps");
	};

	return (
		<TouchableOpacity onPress={handleStart} style={styles.startButton}>
			<Text style={styles.startText}>
				{subscriptionState ? "Detener" : "Iniciar"}
			</Text>
			{subscriptionState ?
				<Image style={styles.stopIcon} source={require("../assets/Stop.png")} />
			:	<Image style={styles.startIcon} source={require("../assets/Play.png")} />}

			<CustomLightModal
				visible={errorModalVisible}
				onClose={() => setErrorModalVisible(!errorModalVisible)}
				errorMessage={error}
			/>
		</TouchableOpacity>
	);
}

export const styles = StyleSheet.create({
	startButton: {
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
		width: 111,
		height: 50,
		paddingBlock: 10,
		borderRadius: 30,
		elevation: 3,
	},
	startText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
	},
	stopIcon: {
		width: 23,
		height: 23,
	},
	startIcon: {
		width: 25,
		height: 25,
	},
});
