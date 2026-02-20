import {
	ActivityIndicator,
	StyleSheet,
	View,
	ScrollView,
	RefreshControl,
} from "react-native";
import UserIndicatorsSection from "./components/UserIndicatorsSection.jsx";
import HeaderBar from "../../components/HeaderBar.jsx";
import { useUser } from "../../context/UserContext.js";
import { useCallback, useEffect, useState } from "react";
import {
	getUserInfoRewards,
	updateOrgEventSteps,
	updateUserTotalSteps,
} from "../../services/apiEndpoints.js";
import ProjectCard from "./components/ProjectCard.jsx";
import CustomModal from "../../tools/CustomModal.jsx";
import { globalStyles } from "../../stylesConstants.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
	const { user, setSteps, orgEvent } = useUser();
	const [sessionRewardModalVisible, setSessionRewardModalVisible] =
		useState(false);
	const [streakRewardModalVisible, setStreakRewardModalVisible] =
		useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const checkUserRewards = useCallback(async (uid) => {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		const today = `${year}-${month}-${day}`;

		// --- VERIFICAR SI YA SE PROCESÓ HOY ---
		let lastCheckDate = null;
		try {
			lastCheckDate = await AsyncStorage.getItem("tracker");
		} catch (error) {
			// Error de lectura (¡corrupción!), limpiamos el valor para forzar el reprocesamiento
			console.error(
				"Error de lectura de AsyncStorage (tracker), limpiando...",
				error,
			);
			await AsyncStorage.removeItem("tracker");
		}

		// 1. Añadir verificación de valor corrupto/inválido
		if (
			lastCheckDate === null ||
			lastCheckDate === "undefined" ||
			lastCheckDate === "null"
		) {
			lastCheckDate = null; // Normalizar a null si el valor es inválido pero no falló la lectura
		}
		console.log("Última verificación de recompensa:", lastCheckDate);

		if (lastCheckDate === today) {
			console.log("Recompensas de hoy ya procesadas.");
			return; // Detiene la función si ya se procesó hoy
		}
		try {
			//en el backend Busca la session de ayer IMPORTANTE
			const responseData = await getUserInfoRewards(uid, today);
			console.log("userInfo rewards in HomeScreen:", responseData);
			await AsyncStorage.setItem("tracker", JSON.stringify(today));
			console.log("Recompensas procesadas y marcadas para hoy:", today);
			//Si existe la sesión de ayer, reviso la cantidad de pasos para premiar
			// y aumento o elimino la racha según el caso
			if (responseData) {
				if (responseData.steps > user.RECOMMENDED_DAILY_STEPS) {
					console.log(
						"Felicitaciones! Superaste los pasos recomendados en un día. ganaste 200 pasos!",
					);
					// modal y actualizar pasos usuario y orgEvent
					setSessionRewardModalVisible(true);
					try {
						const updateResponse = await updateUserTotalSteps(
							uid,
							user.SESSION_REWARD,
						);
						console.log("User total steps updated:", updateResponse);
						setSteps(updateResponse.newTotalSteps);
					} catch (error) {
						console.log("Error updating user total steps:", error);
					}

					try {
						await updateOrgEventSteps(orgEvent._id, user.SESSION_REWARD);
					} catch (error) {
						console.log("Error updating Org Event total steps:", error);
					}
				}
				//Busco el conteo de racha, si existe, actualizo sumando 1
				// Si no existe, lo inicio en 1
				const streakCount = await AsyncStorage.getItem("streak");
				console.log("Streak in LS:", streakCount);

				if (streakCount && responseData.steps > 2000) {
					let parsedStreakCount = 0;
					try {
						parsedStreakCount = JSON.parse(streakCount);
						// Validación de tipo: Asegurar que es un número
						if (typeof parsedStreakCount !== "number" || isNaN(parsedStreakCount)) {
							throw new Error("Streak is not a number.");
						}
					} catch (parseError) {
						// Si falla el parseo o la validación, reiniciamos la racha a 0.
						console.warn("Error de parseo de racha. Reiniciando...", parseError);
						parsedStreakCount = 0;
						await AsyncStorage.removeItem("streak");
						// No continuamos con el proceso de racha para evitar más errores
					}
					// Solo si la racha fue válida, continuamos con el incremento
					if (parsedStreakCount > 0) {
						// Si se reinició a 0, no entra aquí, solo en el else de abajo
						// ... (Toda la lógica de incremento y premio de racha) ...
						await AsyncStorage.setItem(
							"streak",
							JSON.stringify(parsedStreakCount + 1),
						);
					} else {
						// Si no había racha o se reinició por error, la iniciamos en 1 si cumple con los pasos
						await AsyncStorage.setItem("streak", JSON.stringify(1));
					}
					//si la racha es igual a 5, premio con pasos y luego reinicio el conteo
					if (parsedStreakCount + 1 === 5) {
						console.log(
							"Felicitaciones! Tuviste una racha de 5 días de caminatas. ganaste 500 pasos!",
						);
						// modal y actualizar pasos usuario y orgEvent
						setStreakRewardModalVisible(true);
						try {
							const updateResponse = await updateUserTotalSteps(
								uid,
								user.STREAK_REWARD,
							);
							console.log("User total steps updated:", updateResponse);
							setSteps(updateResponse.newTotalSteps);
						} catch (error) {
							console.log("Error updating user total steps:", error);
						}

						try {
							await updateOrgEventSteps(orgEvent._id, user.STREAK_REWARD);
						} catch (error) {
							console.log("Error updating Org Event total steps:", error);
						}
						await AsyncStorage.removeItem("streak");
					}
				}
			} else {
				await AsyncStorage.removeItem("streak");
			}
		} catch (error) {
			console.log(error);
			await AsyncStorage.removeItem("tracker", today);
		}
	}, []);

	// Esta función se ejecuta al deslizar hacia abajo
	const onRefresh = useCallback(async () => {
		if (user?.id) {
			setRefreshing(true);
			await checkUserRewards(user.id);
			setRefreshing(false);
		}
	}, [user?.id, checkUserRewards]);

	useEffect(() => {
		if (user?.id) checkUserRewards(user.id);
	}, [user?.id, checkUserRewards]);

	return (
		<View style={styles.container}>
			{user ?
				<HeaderBar title={"Home"} subTitle={"Tu acción suma"} />
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView
					style={styles.content}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					<ProjectCard />

					<UserIndicatorsSection />
				</ScrollView>
			:	<ActivityIndicator size="large" />}

			<CustomModal
				visible={sessionRewardModalVisible}
				onClose={() => setSessionRewardModalVisible(false)}
				title="Felicitaciones!"
				message="Superaste los pasos recomendados en una sola sesión. Ganaste 200 pasos!."
				backgroundColor="#67a59958"
				iconName="checkmark-circle-outline"
				iconColor={globalStyles.colors.primary}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setSessionRewardModalVisible(false);
						},
						style: { backgroundColor: globalStyles.colors.tertiary },
					},
				]}
			/>
			<CustomModal
				visible={streakRewardModalVisible}
				onClose={() => setStreakRewardModalVisible(false)}
				title="Felicitaciones!"
				message="Tuviste una racha de 5 días de caminatas. Ganaste 500 pasos!."
				backgroundColor="#67a59958"
				iconName="checkmark-circle-outline"
				iconColor={globalStyles.colors.primary}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setStreakRewardModalVisible(false);
						},
						style: { backgroundColor: globalStyles.colors.tertiary },
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		gap: "3%",
	},
});
